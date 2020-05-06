(function ($) {
  
    var myNewTaskForm = $('#new-comment-form'),
      newNameInput = $('#new-comment'),
      itemID = $('#itemID')
      username = $('#username')
    //   newDecriptionArea = $('#new-task-description'),
      todoArea = $('#todo-area');
  
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
        var newName = newNameInput.val();
        // var newDescription = newDecriptionArea.val();
        var newContent = $('#new-content');
        console.log("New name is " + newName)
        console.log(itemID.val())
        console.log(username.val())
        if (newName) {
            var requestConfig = {
                method: 'POST',
                url: '/api/todo.html',
                contentType: 'application/json',
                data: JSON.stringify({
                username: username.val(),
                comment: newName,
                itemID: itemID.val()
                // description: newDescription
                })
            };
            console.log(requestConfig)
            $.ajax(requestConfig).then(function (responseMessage) {
                console.log(responseMessage);
                var newElement = $(responseMessage);
                bindEventsToTodoItem(newElement);
    
                todoArea.append(newElement);
            });
        }
    });
})(window.jQuery);
