import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { Todo } from "./Todos";

const todo = new Todo("Title", "Desc", new Date(), 0, "...notes", "TodoChanged");
console.log(todo);