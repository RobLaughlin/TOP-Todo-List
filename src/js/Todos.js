import PubSub from "./PubSub";
import { v4 as uuidv4 } from 'uuid';

export class Todo {
    #title;
    #description;
    #dueDate;
    #priority;
    #notes;
    #uuid = uuidv4();

    onChange = null;

    /**
     * Creates a Todo
     * 
     * @param {string} title The title of the Todo 
     * @param {string} description The description of the Todo
     * @param {Date} dueDate The due date of the Todo
     * @param {number} priority The priority of the Todo (an integer, lower is higher priority)
     * @param {string} [notes=""] Optional notes to include with the Todo
     * @param {?string} [onChange=null] The event to publish when a todo is changed.
     * If onChange is null, then no event will be published. 
     * Otherwise, publish using the current Todo object as data.
     */
    constructor(title, description, dueDate, priority, notes="", onChange=null) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#notes = notes;
        this.onChange = onChange;
    }

    get title() { return this.#title; }
    set title(value) {
        this.#title = value;
        if (this.onChange !== null) { PubSub.publish(this.onChange, this) };
    }

    get description() { return this.#description; }
    set description(value) {
        this.#description = value;
        if (this.onChange !== null) { PubSub.publish(this.onChange, this) };
    }

    get dueDate() { return this.#dueDate; }
    set dueDate(value) {
        this.#dueDate = value;
        if (this.onChange !== null) { PubSub.publish(this.onChange, this) };
    }

    get priority() { return this.#priority; }
    set priority(value) {
        this.#priority = value;
        if (this.onChange !== null) { PubSub.publish(this.onChange, this) };
    }

    get notes() { return this.#notes; }
    set notes(value) {
        this.#notes = value;
        if (this.onChange !== null) { PubSub.publish(this.onChange, this) };
    }

    get uuid() { return this.#uuid; }
}

export class Project {
    #name = ""
    #todos = []
    onChange = null
    #uuid = uuidv4();

    /**
     * A container for an array of Todos, with a given name
     * @param {string} name The name of the project
     * @param {Todo[]} [todos=[]] The array of todos
     * @param {?string} [onChange=null] The event to be broadcast when a todo is changed
     */
    constructor(name, todos=[], onChange=null) {
        this.#name = name;
        this.#todos = [...todos];
        this.onChange = onChange;
    }

    get name() { return this.#name; }

    get todos() { return [...this.#todos]}

    get uuid() { return this.#uuid; }

    /**
     * The number of todos in the project
     * @returns The number of todos 
     */
    size() {
        return this.#todos.length;
    }

    /**
     * Adds a Todo to the array of Todos
     * @param {Todo} todo The todo to be added
     */
    add(todo) {
        this.#todos.push(todo);
        if (this.onChange !== null) { PubSub.publish(this.onChange, this); }
    }

    /**
     * Removes a todo from the project by index
     * @param {number} idx The index of the todo to be removed
     */
    remove(idx) {
        if (idx < 0 || idx >= this.#todos.length) {
            throw new RangeError("Index of todo out of range.");
        }
        this.#todos.splice(idx, 1);
        if (this.onChange !== null) { PubSub.publish(this.onChange, this); }
    }

    /**
     * Gets the todo from the corresponding index
     * @param {number} idx The index of the corresponding todo
     */
    get(idx) {
        if (idx < 0 || idx >= this.#todos.length) {
            throw new RangeError("Index of todo out of range.");
        }
        return this.#todos[idx];
    }
} 