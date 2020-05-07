(function ($) {
  
    var myNewTaskForm = $('.create-new-comment'),
        commentInput  = $('.new-comment'),
        itemIDInput   = $('.itemID'),
        usernameInput = $('.username'),
        todoArea      = $('#todo-area');
  
    function bindEventsToTodoItem(todoItem) {
      todoItem.find('.finishItem').on('click', function (event) {
        event.preventDefault();
        var currentLink = $(this);
        var currentId = currentLink.data('id');
  
        var requestConfig = {
          method: 'POST',
          url: '/api/todo/complete/' + currentId
        };
  
        $.ajax(requestConfig).then(function (responseMessage) {
          var newElement = $(responseMessage);
          bindEventsToTodoItem(newElement);
          todoItem.replaceWith(newElement);
        });
      });
    }
  
    todoArea.children().each(function (index, element) {
      bindEventsToTodoItem($(element));
    });
  
    myNewTaskForm.submit(function (event) {
        event.preventDefault();
        console.log("submission pressed")
        var comment  = commentInput.val();
        var itemID   = itemIDInput.val()
        var username = usernameInput.val()

        console.log(comment)
        console.log(itemID)
        console.log(username)
        if (comment) {
            console.log("there is a comment")
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
                bindEventsToTodoItem(newElement);
    
                todoArea.append(newElement);
            });
        } else {
          console.log("no comment was passed")
        }
    });
})(window.jQuery);
