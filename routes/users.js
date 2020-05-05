const express = require('express');
const router = express.Router();

const data = require('../data');
const userData = data.users;

router.get("/", (req, res) => {
    console.log("in pages/user")
    //User is not logged in, send them back to login
    if(!req.session.user){
        res.render("pages/login")
    } else {
        //Get user info to display
        console.log(req.body.user);
        user = userData.getUserByUsername(req.body.user.username);
        res.render("pages/user", {user: user});
    }
});

module.exports = router;
