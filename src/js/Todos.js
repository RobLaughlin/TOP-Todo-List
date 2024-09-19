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
    #todos

    /**
     * 
     * @param {Todo[]} [todos=[]] An array of Todos 
     */
    constructor(todos=[]) {
        this.#todos = todos.map(todo => ({...todo}));    
    }
}

export class ProjectList {
    #projects

    /**
     * 
     * @param {Project[]} projects An array of projects 
     */
    constructor(projects=[]) {
        this.#projects = projects.map(project => ({...project}));
    }
}