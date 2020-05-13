const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments
const itemData    = data.items
const xss = require('xss');

router.post('/comment.html', async function (request, response) {
    const newTodo = await commentData.addComment(
        xss(request.session.user.username),
        xss(request.body.comment),
        xss(request.body.itemID)
    );
    const addComment = await itemData.addCommentToItem(request.body.itemID, newTodo._id, request.session.user.username, request.body.comment)
    response.render('partials/comment', { layout: null, ...newTodo });
});

module.exports = router;