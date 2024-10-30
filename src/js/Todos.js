import PubSub from "./PubSub";
import { v4 as uuidv4 } from 'uuid';

class Listenable {
    _validEvents = new Set();
    _eventHandlers = new Map();

    /**
     * Creates a set of what events are considered valid
     * @param {Set<string>} validEvents A set of valid events
     */
    constructor(validEvents) {
        this._validEvents = validEvents;

        this._validEvents.forEach(e => {
            this._eventHandlers.set(e, new Map());
        });
    }

    /**
     * Adds an event listener to this object. The event id must be a valid event in Todo.EVENTS,
     * whereas the callback id can be anything.
     * @param {string} event The event id to trigger
     * @param {string} id The id of the callback function
     * @param {Function(Todo)} callback The function to be called when the event triggers
     */
    addEventListener(event, id, callback) {
        if (!(event in this._validEvents)) {
            throw new Error(`Invalid event ${event}`);
        }
        this._eventHandlers.get(event).set(id, callback);
    }

    /**
     * Removes an event listener from this object. The event id must be a valid event in Todo.EVENTS,
     * whereas the callback id can be anything.
     * @param {string} event The event id to trigger
     * @param {string} id The id of the callback function
     */
    removeEventListener(event, id) {
        if ((this._validEvents.has(event)) && (this._eventHandlers.get(event).has(id))) {
            this._eventHandlers.get(event).delete(id);
        }
    }
};

export class Todo extends Listenable {
    static EVENTS = {
        onChange: "onChange"
    };

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
        super(Object.values(Todo.EVENTS));
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#notes = notes;
    }

    get title() { return this.#title; }
    set title(value) {
        this.#title = value;
        this.#onChange();
    }

    get description() { return this.#description; }
    set description(value) {
        this.#description = value;
        this.#onChange();
    }

    get dueDate() { return this.#dueDate; }
    set dueDate(value) {
        this.#dueDate = value;
        this.#onChange();
    }

    get priority() { return this.#priority; }
    set priority(value) {
        this.#priority = value;
        this.#onChange();
    }

    get notes() { return this.#notes; }
    set notes(value) {
        this.#notes = value;
        this.#onChange();
    }

    get uuid() { return this.#uuid; }

    /**
     * Calls every callback subscribed to the onChange event
     * @private
     */
    #onChange() {
        for (const [_, callback] of this._eventHandlers.get(Todo.EVENTS.get('onChange'))) {
            callback(this);
        }
    }
}

export class Project extends Listenable {
    static EVENTS = {
        onChange: "onChange"
    };

    #name = ""
    #todos = []
    #uuid = uuidv4()

    /**
     * A container for an array of Todos, with a given name
     * @param {string} name The name of the project
     * @param {Todo[]} [todos=[]] The array of todos
     * @param {?string} [onChange=null] The event to be broadcast when a todo is changed
     */
    constructor(name, todos=[]) {
        super(Object.values(Project.EVENTS));
        this.#name = name;
        this.#todos = [...todos];
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
        this.#onChange();
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
        this.#onChange();
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
     * Calls every callback subscribed to the onChange event
     * @private
     */
    #onChange() {
        for (const [_, callback] of this._eventHandlers.get(Project.EVENTS['onChange'])) {
            callback(this);
        }
    }
} 