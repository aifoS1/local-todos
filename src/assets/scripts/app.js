'use strict'

var localTodos = (function (window, document, $, undefined) {
  // Force localStorage to be the backend driver.
  localforage.setDriver(localforage.LOCALSTORAGE);
  const dbName = 'todos';
  var todoObject = {};
  var todoArr = [];
  var todo;


//for each object in todos array in local storage, create a new todo list item and append to DOM
  function loadTodos(){
    localforage.getItem(dbName, function(err, todos) {
      for (var i = 0; i < todos.length; i ++) {
        console.log('todos i ', todos[i])
         new TodoView(todos[i]);
      }
      if (err) {
        console.log("error when trying to load todos from local storage: ", err)
      }
    })
  }

  function checkDB(){

     localforage.length().then(function(numberOfKeys) {
    // Outputs the length of the local storage database.
        console.log(numberOfKeys);  
        //if there are todos in the array then call the loadTodos() function which appends the todos to the DOM for user to see. If no todos exist then do nothing.
        numberOfKeys > 0 ? loadTodos() : false

    }).catch(function(err) {
        // This code runs if there were any errors
        console.log('error grabbing length or local storage key: ', err);
    });
    
  }

  function addTodo(){
    $('#todo-form').on('submit', function(e){
      e.preventDefault();
      //assign global todo variable to input value
      todo = this.elements[0].value;
      //clear form after submit
      this.elements[0].value = '';

      checkLocalStorage()
    })
  }

  //check if 'todos' key exists in localstorage and when that is done call the iniateDB function which passes the returned value if not an error.
  var checkLocalStorage = function() {
    //try to get the 'todos' ob
    localforage.getItem(dbName).then(iniateDB).catch(function(err){
      console.log("there was an error when checking local storage for todoObject: ", err)
    })
  }

//if value is not null (localforage returns null if 'todos' item doesn't exist in local storage), then set todo Array to the value of the array returned from local storage. Then create a new Todo Object in the DB by instatiating the Todo class. If value is null, call function to set Todos to an empty array in local storage then create a new Todo Object.
  var iniateDB = function(data){
    var todos = data;
    var db;

    console.log('initdb val: ', todos + todo)

    if (todos != null) {
        todoArr = todos;
        new Todo(todo, todoArr)
    }
    else {
      setLocalStorage()
    }
  }
//set name of database with value pointing to empty array (to hold todo objects)
  var setLocalStorage = function(){
    localforage.setItem(dbName, todoArr, function(err, value){
      console.log("setting item: ", value)
        new Todo(todo)
      if (err) {
        console.log('error setting local storage: ', err)
      }
    })
  }

//creates todo objects and pushes new todo objects to the 'todos' array in local storage. Default todo array is the empty array set globally. I create a new todo by setting up the todo object's key/value pairs. Then call the assTodo function.
  class Todo {
    constructor(todo, todoArray = todoArr) {
      this.todoArr = todoArray;
      this._id = this.createID();
      this.complete = false;
      this.description = todo;
      this.createTodoObject();
    }
    //push new todo object into the todoArray, then set that item in local storage. Upon successful completion create a todo list item to append to DOM for client to see.
    addTodo(todo){
      this.todoArr.push(todo)
      localforage.setItem(dbName, this.todoArr).then(function(value){
        console.log('todo array: ', value)
        new TodoView(todo);
      }.bind(this)).catch(function(err){
        console.log("an error ocurred when saving to localstorage: ", err)
      })
    }

    createTodoObject(){
      let todo = {
                  _id: this._id, 
                  description: this.description, 
                  complete: this.complete
                }
      this.addTodo(todo)
    }
    //using time for ID because these IDs for simplicity.
    createID(){
      let timestamp = Math.floor(Date.now() / 1000)
      return timestamp
    }
  }

//create list item containing todo info and append to todolist on DOM
  class TodoView {
    constructor(todo) {
      this.todo = todo
      this.addTodoToList(this.todo)
      this.markComplete();
      
    }

    addTodoToList(todo){
      let todoList = $('.todoList--list')
      todoList.append(this.createTodoListItem(todo))      
    }

    markComplete(){
      var _this = this;
      $('#' + this.todo._id).on('click', function(e) {
         let todoID = $(this).attr('id')
         // console.log($(this).attr('id'))
         $(this).closest('li').remove()
         _this.removeTodo(todoID)
      })
    }
    //get todos from local storage than remove todo that matches ID of element marked completed then set local storage with updated array
    removeTodo(todoID){
      localforage.getItem(dbName, function(err, val){ 
        var todosArr = val;
        console.log(todoID)
        todosArr.forEach(function(todo){
          if (todo['_id'] == todoID) {
            todosArr.pop(todo)
          }
          console.log(todosArr)
        })

        if (err) {
          console.log('there was an error when getting todoList for delete of todo: ', err)
        }

        localforage.setItem(dbName, todosArr, function(err, val){
          if (err) {
            console.log('there was an error when updating todoList after delete of todo: ', err)
          }
          return
        })
      })
    }

    createTodoListItem(todo) {  
      return `<li class="todoList--list-item">${todo.description}<button class="completeBtn" id="${todo._id}">Complete</button></li>`
    }
  }

	function init() {
    addTodo();
    checkDB();
	}

	return {
		init: init
	};


})(window, document, jQuery);


localTodos.init();



