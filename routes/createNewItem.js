const express = require('express');
const router = express.Router();

const data = require('../data');
const userData = data.users;
const itemData = data.items;


router.post('/', async (req, res) =>  {
    console.log("In /createNewItem")
    if(!req.session.user){
        console.log("user not logged in")
        res.render('pages/login', {loggedIn: false})
    } 
    console.log("user logged in")
    res.render('pages/createNewItem')
    console.log(createItemName)
    //Idk whats happening here its 5:21 am and I gotta sleep
    // res.render('pages/createNewItem', {loggedIn: true})

});

router.post('/add', async(req, res) => {
    console.log("in createnewitem/add")
    const { createItemName, createItemDescription, createCategories, createStartingPrice, createImageLink} = req.body
    console.log(createItemName)
    console.log(createItemDescription)
    console.log(createCategories)
    console.log(createStartingPrice)
    console.log(createImageLink)
    if(!createItemName || !createItemDescription || createCategories || createStartingPrice || createImageLink){
        console.log("missing inputs")
        res.render('pages/createNewItem')
    }

    //Cleaning category input
    catTokens = createCategories.split(",")
    catTokens = catTokens.join("").split("")

    //Cleaning price input
    let startingPrice = parseFloat(createStartingPrice)

    //Getting sellerID
    // let sellerID = req.session.user
    let user = await userData.getUserbyUsername(req.session.user.username)
    console.log(user)
    let sellerUN = user.username
    console.log("sellerID = " + sellerID)
    try {
        itemData.addItem(createItemName, createItemDescription, sellerUN, catTokens, startingPrice, createImageLink)
    } catch (error) {
        //nothing
    }
});

module.exports = router; 