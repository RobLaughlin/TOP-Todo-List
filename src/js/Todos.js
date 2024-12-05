import { v4 as uuidv4 } from 'uuid';

class ChangeListener {
    _toChange = new Map();

    /**
     * Adds a callback function to be called when data is changed
     * @param {Function(Todo)} callback The callback function to be called when data is changed
     * @returns {string} The ID of the callback function
     */
    addChangeListener(callback) {
        const callbackId = uuidv4();
        this._toChange.set(callbackId, callback);
        return callbackId;
    }

    /**
     * Removes a callback function via the associated callback function ID if it exists
     * @param {string} callbackId The ID of the callback function 
     * @returns {?string} The ID of the callback function if such an ID exists. Returns null if the callback ID is not found
     */
    removeChangeListener(callbackId) {
        if (!(this._toChange.has(callbackId))) {
            return null;
        }

        this._toChange.delete(callbackId);
        return callbackId;
    }

    changed() {
        this._toChange.values().forEach(callback => {
            callback(this);
        });
    }
};

export class Todo extends ChangeListener {
    #title;
    #description;
    #dueDate;
    #priority;
    #notes;
    #uuid = uuidv4();
    
    /**
     * Creates a Todo
     * 
     * @param {string} title The title of the Todo 
     * @param {string} description The description of the Todo
     * @param {Date} dueDate The due date of the Todo
     * @param {number} priority The priority of the Todo (an integer, lower is higher priority)
     * @param {string} [notes=""] Optional notes to include with the Todo
     */
    constructor(title, description, dueDate, priority, notes="") {
        super();
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#notes = notes;
    }

    get title() { return this.#title; }
    set title(value) {
        this.#title = value;
        this.changed();
    }

    get description() { return this.#description; }
    set description(value) {
        this.#description = value;
        this.changed();
    }

    get dueDate() { return this.#dueDate; }
    set dueDate(value) {
        this.#dueDate = value;
        this.changed();
    }

    get priority() { return this.#priority; }
    set priority(value) {
        this.#priority = value;
        this.changed();
    }

    get notes() { return this.#notes; }
    set notes(value) {
        this.#notes = value;
        this.changed();
    }
    
    get uuid() { return this.#uuid; }
}

export class Project extends ChangeListener {
    #opened = false
    #name = ""
    #todos = []
    uuid = uuidv4()

    /**
     * A container for an array of Todos, with a given name
     * @param {string} name The name of the project
     * @param {Todo[]} [todos=[]] The array of todos
     */
    constructor(name, todos=[]) {
        super();
        this.#name = name;
        todos.forEach(todo => {
            this.add(todo);
        });
    }

    get opened() { return this.#opened; }

    get name() { return this.#name; }
    set name(name) {
        this.#name = name;
        this.changed();
    }
    
    get todos() { return this.#todos }

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
        this.#todos[this.size()-1].addChangeListener(todo => {
            console.log(this);
            this.changed();
        });
        this.changed();
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
        this.changed();
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

    /**
     * Opens the project
     */
    open() { 
        this.#opened = true; 
        this.changed();
    }

    /**
     * Closes the project
     */
    close() {
        this.#opened = false;
        this.changed();
    }
} 