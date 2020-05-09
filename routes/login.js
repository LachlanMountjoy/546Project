const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const data = require('../data');
const userData = data.users;
const itemData = data.items;
const ObjectId = require('mongodb').ObjectID;

const saltRounds = 10


router.post('/', async (req, res) =>  {
    console.log("In /login")
    if(!req.session.user){
        console.log("user not logged in")
        res.render('pages/login', {loggedIn: false})
    } else {
        console.log("User already logged in, get user info and show their page");
        //console.log(req.session.user);
        try {
            let user = await userData.getUserbyUsername(req.session.username);
        } catch (error) {
            console.log(error)
        }
        //console.log(req.session.user.username);
        let user = await userData.getUserbyUsername(req.session.user.username);
        //console.log("user = " + user.itemsForSale);
       let items1 = await itemData.getItemByUser(req.session.user.username);
       //console.log(items1);
       let items2 = await itemData.getItemByBidder(req.session.user.username);
       //console.log(items2);
        res.render('pages/user', {user: user, items1: items1, items2: items2, loggedIn: true});
    }
});


router.post('/createUser', async (req, res) =>  {
    //If a user is logged in, send them back to the main page, this will eventually redirect them to the /pages/user
    if(req.session.user){
        res.render('pages/login', {loggedIn: true})
    } else {
        const { createUsername, createEmail, createPassword, createLN, createFN, createLocation } = req.body
        //console.log(req.body)

        if(!createUsername | !createEmail | !createPassword | !createLN | !createFN | !createLocation){
            console.log("Missing field info")
            res.render('pages/login', {loggedIn: false})
            return
        }

        let cleanUsername = createUsername.replace(/\W/g, '');
        let cleanPassword = createPassword;
        let cleanEmail = createEmail;

        console.log("clean username = " + cleanUsername)
        console.log("input username = " + createUsername)

        if(cleanUsername != createUsername){
            console.log("user passed invalid charcters for the UN")
            res.render('pages/login', {loggedIn: false, error: "Error: Username can only contain the characters [^0-9a-zA-Z_]"})
            return
        }
        // console.log("clean password = " + cleanPassword)
        // console.log("clean email = " + cleanEmail)
        // console.log(createLN)
        // console.log(createFN)
        // console.log(createLocation)

        //In the future, these two checks can be done client side
        //Username already in db

        let user = await userData.getUserbyUsername(cleanUsername);
        let user2 = await userData.getUserbyEmail(cleanEmail);
        console.log("got user and user 2 from db")


        // console.log(user)
        // console.log(user2)

        // if(user){
        //     console.log("ASDADSF")
        // }

        //Email or username already in DB
        if(user || user2){
            console.log("username or email already in db")
            res.render('pages/login', {error: "Error: Username or email already taken", loggedIn: false})
            return
        }

        //Creating a new user
        try {
            console.log("adding user to db")

            await userData.addUser(createFN, createLN, cleanEmail, createLocation, createPassword, cleanUsername)
        } catch (error) {
            // console.log(error)
            res.json(error)
        }

        //Setting session
        req.session.user = {
            firstName: createFN,
            lastName: createLN,
            username: cleanUsername,
            email: cleanEmail,
            location: createLocation,
        };
        user = await userData.getUserbyUsername(cleanUsername);
        // console.log("USER =============== " + user)
        res.render('pages/user', {user:user, loggedIn: true})
    }
});

router.post('/verifyUser', async (req, res) => {
    // console.log("verifying user info")
    const { username, password } = req.body
    try {
        // console.log("getting user")
        let user = await userData.getUserbyUsername(username)
    } catch(e) {
        console.log(e);
        // console.log("err from getUserbyUsername")
        res.render('pages/login', {loggedIn:false})
    }

    //User is in DB
    let user = await userData.getUserbyUsername(username)
    let match = false;
    // console.log(user)
    try {
        if(user == null){
            res.render('pages/login', {loggedIn: false, error: "No account with that username"})
            //added this return
            return
        }
       // console.log("creating match var")
        //console.log("pass = " + user.password)
        match = await bcrypt.compare(password, user.password);

        //Username and password are valid
        if(match) {
            console.log("passwords match")
            req.session.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                location: user.location
            };
            // console.log("user is " + user)
           let items1 = await itemData.getItemByUser(req.session.user.username);
           //console.log(items1);
           let items2 = await itemData.getItemByBidder(req.session.user.username);
           //console.log(items2);
            res.render('pages/user', {user: user, items1: items1, items2: items2, loggedIn: true});
        } else {
            // console.log("passwords dont watch")
            res.render('pages/login', {loggedIn: false, error: "Username and password don't match"})
        }
    } catch (e) {
        //Do nothing
        console.log(e)
    }
})

module.exports = router;