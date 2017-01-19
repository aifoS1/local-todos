'use strict'

var localStorage = (function (window, document, $, undefined) {
  const dbName = 'todos';
  var todoArr = [];

  function addTodo(){
    $('#todo-form').on('submit', function(e){
      e.preventDefault();

      let todo = $(this).elements[0].value;
    })
  }

  var checkLocalStorage = function(todo) {
    if (iniateDB) {
      new Todo(todo)
    }
  }

//check if 'todos' key exists in localstorage if not create set the key with an empty array as value.
  var iniateDB = function(){
    localforage.getItem(dbName, function(err, value){
       if (value !== null) {
        return true
       } else {
         localforage.setItem(dbName, todoArr)
       } 
      if (err) {
        console.log("there was an error connecting to localstorage:", err)
      }
    })
  }

  class Todo {
    constructor(args) {
      this.complete = args.complete || false;
      this.description = args.todo;
      this.addTodo({description: this.description, complete: this.complete})
    }

    addTodo(todo){
      todoArr.push(todo)
      localforage.setItem(dbName, todoArr).then(function(value){
        createTodoListItem(value)
      }.catch(function(err){
        console.log("an error ocurred when saving to localstorage: ", err)
      })
    }

    addTodoToList(){
      let todoList = $('.todoList--list')
      todoList.append(this.createTodoListItem())      
    }

    markComplete(){

    }

    deleteTodo(){

    }

    createTodoListItem(todo) {
      return `<li>${todo.description}<button>Complete</button></li>`
    }
  }






	function init() {
    addTodo();
	}

	return {
		init: init
	};


})(window, document, jQuery);


localStorage.init();