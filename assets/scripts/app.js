'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var localTodos = function (window, document, $, undefined) {
  // Force localStorage to be the backend driver.
  localforage.setDriver(localforage.LOCALSTORAGE);
  var dbName = 'todos';
  var todoObject = {};
  var todoArr = [];
  var todo;

  //for each object in todos array in local storage, create a new todo list item and append to DOM
  function loadTodos() {
    localforage.getItem(dbName, function (err, todos) {
      for (var i = 0; i < todos.length; i++) {
        console.log('todos i ', todos[i]);
        new TodoItem(todos[i]);
      }
      if (err) {
        console.log("error when trying to load todos from local storage: ", err);
      }
    });
  }

  function checkDB() {

    localforage.length().then(function (numberOfKeys) {
      // Outputs the length of the local storage database.
      console.log(numberOfKeys);
      //if there are todos in the array then call the loadTodos() function which appends the todos to the DOM for user to see. If no todos exist then do nothing.
      numberOfKeys > 0 ? loadTodos() : false;
    }).catch(function (err) {
      // This code runs if there were any errors
      console.log('error grabbing length or local storage key: ', err);
    });
  }

  function addTodo() {
    $('#todo-form').on('submit', function (e) {
      e.preventDefault();
      //assign global todo variable to input value
      todo = this.elements[0].value;
      //clear form after submit
      this.elements[0].value = '';

      checkLocalStorage();
    });
  }

  //check if 'todos' key exists in localstorage and when that is done call the iniateDB function which passes the returned value if not an error.
  var checkLocalStorage = function checkLocalStorage() {
    //try to get the 'todos' ob
    localforage.getItem(dbName).then(iniateDB).catch(function (err) {
      console.log("there was an error when checking local storage for todoObject: ", err);
    });
  };

  //if value is not null (localforage returns null if 'todos' item doesn't exist in local storage), then set todo Array to the value of the array returned from local storage. Then create a new Todo Object in the DB by instatiating the Todo class. If value is null, call function to set Todos to an empty array in local storage then create a new Todo Object.
  var iniateDB = function iniateDB(data) {
    var todos = data;
    var db;

    console.log('initdb val: ', todos + todo);

    if (todos != null) {
      todoArr = todos;
      new Todo(todo, todoArr);
    } else {
      setLocalStorage();
    }
  };
  //set name of database with value pointing to empty array (to hold todo objects)
  var setLocalStorage = function setLocalStorage() {
    localforage.setItem(dbName, todoArr, function (err, value) {
      console.log("setting item: ", value);
      new Todo(todo);
      if (err) {
        console.log('error setting local storage: ', err);
      }
    });
  };

  //creates todo objects and pushes new todo objects to the 'todos' array in local storage. Default todo array is the empty array set globally. I create a new todo by setting up the todo object's key/value pairs. Then call the assTodo function.

  var Todo = function () {
    function Todo(todo) {
      var todoArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : todoArr;

      _classCallCheck(this, Todo);

      this.todoArr = todoArray;
      this.complete = false;
      this.description = todo;
      this.addTodo({ description: this.description, complete: this.complete });
      this.markComplete();
    }
    //push new todo object into the todoArray, then set that item in local storage. Upon successful completion create a todo list item to append to DOM for client to see.


    _createClass(Todo, [{
      key: 'addTodo',
      value: function addTodo(todo) {
        this.todoArr.push(todo);
        localforage.setItem(dbName, this.todoArr).then(function (value) {
          console.log('todo array: ', value);
          new TodoItem(todo);
        }.bind(this)).catch(function (err) {
          console.log("an error ocurred when saving to localstorage: ", err);
        });
      }
    }, {
      key: 'markComplete',
      value: function markComplete() {
        $('.completeBtn').on('click', function (e) {});
      }
    }]);

    return Todo;
  }();

  //create list item containing todo info and append to todolist on DOM


  var TodoItem = function () {
    function TodoItem(todo) {
      _classCallCheck(this, TodoItem);

      this.todo = todo;
      this.addTodoToList(this.todo);
    }

    _createClass(TodoItem, [{
      key: 'addTodoToList',
      value: function addTodoToList(todo) {
        var todoList = $('.todoList--list');
        todoList.append(this.createTodoListItem(todo));
      }
    }, {
      key: 'createTodoListItem',
      value: function createTodoListItem(todo) {
        return '<li class="todoList--list-item" data-id="">' + todo.description + '<button id="mark-complete" class="completeBtn">Complete</button></li>';
      }
    }]);

    return TodoItem;
  }();

  function init() {
    addTodo();
    checkDB();
  }

  return {
    init: init
  };
}(window, document, jQuery);

localTodos.init();