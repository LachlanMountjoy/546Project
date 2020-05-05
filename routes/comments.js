const express = require('express');
const router = express.Router();

const data = require('../data')
const itemData = data.items


router.post('/', async (req, res) => {

})



router.post('/createNewComment', async (req, res, commentID) => {
    console.log(commentID)
})

module.exports = router;