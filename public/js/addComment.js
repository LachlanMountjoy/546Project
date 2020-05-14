(function ($) {
  
    var myNewTaskForm  = $('.create-new-comment'),
        commentInput   = $('.new-comment'),
        itemIDInput    = $('.itemID'),
        usernameInput  = $('.username'),
        newCommentArea = $('.new-comment');

  
    myNewTaskForm.submit(function (event) {
        event.preventDefault();

        var comment  = commentInput.val();
        var itemID   = itemIDInput.val()
        var username = usernameInput.val()

        if (comment) {
            var requestConfig = {
                method: 'POST',
                url: '/api/comment.html',
                contentType: 'application/json',
                data: JSON.stringify({
                  comment: comment,
                  itemID: itemID,
                  username: username
                })
            }
            console.log(requestConfig)
            $.ajax(requestConfig).then(function (responseMessage) {
                console.log("response message = " + responseMessage);
                var newElement = $(responseMessage);
    
                newCommentArea.append(newElement);
            });
        } else {
          console.log("no comment was passed")
        }
    });
})(window.jQuery);
