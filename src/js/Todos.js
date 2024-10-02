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

export class Project extends Map {
    #name = ""
    #uuid = uuidv4()

    /**
     * A Map of Todos associated by Todo UUID
     * @param {string} name The name of the project
     * @param {Todo[]} [todos=[]] An array of Todos to be put into an UUID map
     */
    constructor(name, todos=[]) {
        let todoPairs = todos.map(todo => [todo.uuid, todo]);
        super(todoPairs);

        this.#name = name;
    }

    get name() { return this.#name; }

    get uuid() { return this.#uuid; }
}  

export class ProjectMap extends Map {
    #projects = {}

    /**
     * A map of Projects associated by Project UUID
     * @param {Project[]} projects The array of projects to be put into an UUID map 
     */
    constructor(projects=[]) {
        let projectPairs = projects.map(project => [project.uuid, project]);
        super(projectPairs);
    }
}