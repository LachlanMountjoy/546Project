const express = require('express');
const router = express.Router();

const data = require('../data')
const itemData = data.items

router.post('/', async (req, res) => {
    console.log("logging user out")
    const items = await itemData.getAllItems()
    req.session.destroy()
    res.render('pages/landing', {loggedIn: false, items: items})
})

module.exports = router;