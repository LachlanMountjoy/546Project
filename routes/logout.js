const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("logging user out")
    req.session.destroy()
    res.render('pages/landing', {loggedIn: false})
})

module.exports = router;