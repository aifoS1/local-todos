"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),localStorage=function(e,t,n,o){function i(){n("#todo-form").on("submit",function(e){e.preventDefault();n(this).elements[0].value})}function a(){i()}(function(){function e(t){_classCallCheck(this,e),this.complete=t.complete||!1,this.description=t.todo}return _createClass(e,[{key:"addTodo",value:function(){var e=n(".todoList--list");e.append(this.createTodoListItem())}},{key:"markComplete",value:function(){}},{key:"deleteTodo",value:function(){}},{key:"createTodoListItem",value:function(e){return"<li>"+e.description+"<button>Complete</button></li>"}}]),e})();return{init:a}}(window,document,jQuery);localStorage.init();