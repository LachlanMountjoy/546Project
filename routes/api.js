const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments
const itemData    = data.items
const xss = require('xss');

router.post('/todo', function (request, response) {
  todoData.makeToDo(xss(request.body.name), xss(request.body.description));
  // response.json({ success: true, message: request.body.description });
  response.json({ success: true, message: xss(request.body.description) });
});

router.post('/todo/complete/:id', function (request, response) {
  const updatedData = todoData.finishToDo(parseInt(request.params.id));
  response.render('partials/todo_item', { layout: null, ...updatedData });
});

router.post('/comment.html', async function (request, response) {
    console.log("in api/comment.html")
    // console.log(request.body.username)
    // console.log(request.body.comment)
    // console.log(request.body.itemID)
    const newTodo = await commentData.addComment(
        xss(request.body.username),
        xss(request.body.comment),
        xss(request.body.itemID)
    );
    console.log(request.body.itemID)
    const addComment = await itemData.addCommentToItem(request.body.itemID, newTodo._id)
    response.render('partials/comment', { layout: null, ...newTodo });
});

module.exports = router;