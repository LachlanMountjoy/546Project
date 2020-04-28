const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const data = require('../data');
const userData = data.users;

const saltRounds = 10


router.post('/', async (req, res) =>  {
    console.log("In /login")
    if(!req.session.user){
        console.log("user not logged in")
        res.render('pages/login', {loggedIn: false})
    } else {
        console.log("User already logged in, get user info and show their page")
        console.log(req.session.user)
        try {
            let user = await userData.getUserbyUsername(req.session.username)
        } catch (error) {
            console.log(error)
        }
        console.log(req.session.user.username)
        let user = await userData.getUserbyUsername(req.session.user.username)
        console.log("user = " + user)
        res.render('pages/user', {user:user, loggedIn: true})
    }
});


router.post('/createUser', async (req, res) =>  {
    //If a user is logged in, send them back to the main page, this will eventually redirect them to the /pages/user

    console.log("in createuser")

    if(req.session.user){
        console.log("user is logged in")
        res.render('pages/login', {loggedIn: true})
    } else {
        console.log("creating a new user")
        const { createUsername, createEmail, createPassword, createLN, createFN, createLocation } = req.body
        console.log(req.body)

        if(!createUsername | !createEmail | !createPassword | !createLN | !createFN | !createLocation){
            console.log("Missing field info")
            res.render('pages/login', {loggedIn: false})
            return
        }

        let cleanUsername = createUsername.replace(/\W/g, '');
        let cleanPassword = createPassword;
        let cleanEmail = createEmail;

        console.log("clean username = " + cleanUsername)
        console.log("clean password = " + cleanPassword)
        console.log("clean email = " + cleanEmail)
        console.log(createLN)
        console.log(createFN)
        console.log(createLocation)

        //In the future, these two checks can be done client side
        //Username already in db
        
        let user = await userData.getUserbyUsername(cleanUsername);
        let user2 = await userData.getUserbyEmail(cleanEmail);
        console.log("got user and user 2 from db")


        console.log(user)
        console.log(user2)

        if(user){
            console.log("ASDADSF")
        }

        //Email or username already in DB
        if(user || user2){
            console.log("username or email already in db")
            res.render('pages/login', {loggedIn: false})
            return
        }

        //Creating a new user
        try {
            console.log("adding user to db")
            await userData.addUser(createFN, createLN, cleanEmail, createLocation, createPassword, cleanUsername)
        } catch (error) {

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
        res.render('pages/user', {user:user, loggedIn: true})
    }
});

router.post('/verifyUser', async (req, res) => {
    console.log("verifying user info")
    const { username, password } = req.body
    try {
        console.log("getting user")
        let user = await userData.getUserbyUsername(username)
    } catch(e) {
        console.log(e);
        console.log("err from getUserbyUsername")
        res.render('pages/login', {loggedIn:false})
    }

    //User is in DB
    let user = await userData.getUserbyUsername(username)
    let match = false;
    console.log(user)
    try {
        console.log("creating match var")
        console.log("pass = " + user.password)
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
            res.render('pages/user', {user: user, loggedIn: true})
        } else {
            console.log("passwords dont watch")
            res.render('pages/login', {loggedIn: false})
        }
    } catch (e) {
        //Do nothing
        console.log(e)
    }
})

module.exports = router; 