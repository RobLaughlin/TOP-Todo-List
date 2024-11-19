import { Project } from "../Todos";
import * as template from "./Sidebar.templates";
import * as handler from "./Sidebar.handlers";

/**
 * Creates the main sidebar component
 * @function
 * @param {Project[]} projects The array of projects to be loaded into the sidebar 
 * @returns {Object} The sidebar component
 */
export const createSidebar = (projects) => {
    /**
     * @member {?string} selected The UUID of the selected project
     * @private
     */
    let selected = projects.length > 0 ? projects[0].uuid : null;
    let searchKey = "";
    let initialRender = true;

    /**
     * Selects a project from the sidebar based on project UUID
     * @method select
     * @param {?string} uuid The UUID of the project to be selected
     * @returns {Project} The project selected
     */
    function select(uuid, callback) {
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            if (project.uuid === uuid) {
                selected = uuid;
                callback(uuid);
                return project;
            }
        }

        throw new Error(`Project UUID ${uuid} not found.`);      
    };

    function setSearchKey(key) {
        searchKey = key;
    }

    /**
     * Filters the project array by only returning projects and todos that match the search key
     * @returns {Project[]} A subset of projects, filtered by the search key
     */
    function filter() {
        const key = searchKey.toLowerCase();
        let filtered = [];

        for (let p = 0; p < projects.length; p++) {
            const project = projects[p];
            const filteredTodos = project.todos.filter(todo => {
                return todo.title.toLowerCase().includes(key);
            });

            // If neither the project name nor any of the todos in the project match the search, hide the project entirely
            const projectMatch = project.name.toLowerCase().includes(key);
            if (!projectMatch && filteredTodos.length === 0) {
                continue;
            }

            const filteredProject = new Project(project.name, Array.from(filteredTodos));
            filteredProject.uuid = project.uuid;
            if (project.opened) {
                filteredProject.open();
            }
            filtered.push(filteredProject);
        }

        return filtered;
    }

    /**
     * Generates the project nodes to be inserted into the sidebar
     * @private
     * @method _createProjectNodes
     * @returns {Node[]} The list of project nodes 
     */
    function _createProjectNodes() {
        let filteredProjects = searchKey === "" ? projects : filter(searchKey);
        let projectNodes = filteredProjects.map((project, p) => {
            let itemContainer = document.createElement("div");
            itemContainer.classList.add("itemContainer");
    
            // Generate project html
            let projectTemplate = document.createElement("template");
            projectTemplate.innerHTML = template.project(project, p);
            let projectNode = projectTemplate.content.querySelector("div");
    
            // Make sure correct project is selected
            if (project.uuid === selected) {
                projectNode.classList.add("selected");
            }
            
            // Add project selection behaviour
            projectNode.addEventListener("click", (e, self=this) => {handler.projectClicked(e, self)});

            // Add folder button click event handler
            let folderBtn = projectNode.querySelector(".folder.icon");
            folderBtn.addEventListener("click", e => { handler.folderBtnClicked(this, projects, e); });
            
            let editProjectBtn = projectNode.querySelector(".editProjectIcon.icon");
            editProjectBtn.addEventListener("click", () => { handler.editProjectBtnClicked(project.name, project.uuid) });

            // Add remove button click event handler
            let removeProjectBtn = projectNode.querySelector(".removeProjectIcon");
            removeProjectBtn.addEventListener("click", e => {
                handler.projectRemoved(e, this);
            });
            itemContainer.appendChild(projectNode);
    
            // Generate todo html
            for (let t = 0; t < project.todos.length; t++) {
                let todoHtml = template.todo(project.todos[t], t);
                let todoTemplate = document.createElement("template");
                todoTemplate.innerHTML = todoHtml;
                let todoNode = todoTemplate.content.querySelector("div");
                let removeTodoBtn = todoNode.querySelector(".removeProjectIcon");
                removeTodoBtn.addEventListener("click", e => {
                    handler.todoRemoved(e, project);
                });

                if (project.opened) {
                    todoNode.classList.remove("invisible");
                }

                itemContainer.appendChild(todoNode);
            }

            // Append add todo item to end of todos
            let addTodoItem = document.createElement("template");
            addTodoItem.innerHTML = template.addTodo();
            addTodoItem = addTodoItem.content.querySelector("div");
            
            if (project.opened) {
                addTodoItem.classList.remove("invisible");
            }

            // Implement add todo behaviour
            let plusIcon = addTodoItem.getElementsByClassName("icon")[0];
            plusIcon.addEventListener("click", () => {handler.addTodoBtnClicked(project.uuid)});

            itemContainer.appendChild(addTodoItem);

            return itemContainer;
        });

        return projectNodes;
    };

    /**
     * Replaces the given root node with the sidebar component HTML
     * @method render
     */
    function render() {
        let root = document.getElementsByClassName("sidebar")[0];

        // Clear all old project html
        let oldProjectNodes = Array.from(root.querySelectorAll(".item.project"));
        oldProjectNodes.forEach(projectNode => {
            projectNode.parentElement.remove();
        });

        // Insert new project nodes
        const projectNodes = this._createProjectNodes();

        // Always insert before the add project container
        const nodeToInsert = root.querySelector(".addProjectContainer").parentElement;
        for (let i = 0; i < projectNodes.length; i++) {
            const node = projectNodes[i];
            nodeToInsert.insertAdjacentElement('beforebegin', node);
        }

        // Run once and only once
        if (initialRender) {
            // Implement behaviour for the add todo modal submit button
            let addTodoBtn = root.querySelector("#AddTodoBtn");
            addTodoBtn.addEventListener("click", e => { handler.addTodoSubmitClicked(this, projects, e) });

            // Implement behaviour for the close button in the todo modal
            let closeBtn = root.querySelector("#TodoCloseBtn");
            closeBtn.addEventListener("click", handler.addTodoCloseClicked);

            let editProjectSaveBtn = root.querySelector("#EditProjectSaveBtn");
            editProjectSaveBtn.addEventListener("click", e => {handler.editProjectSaveBtnClicked(e, projects)});
            // let editProjectCloseBtn = root.querySelector("EditProjectCloseBtn");

            let editProjectCloseBtn = root.querySelector("#EditProjectCloseBtn");
            editProjectCloseBtn.addEventListener("click", handler.editProjectCloseBtnClicked);

            let searchInput = root.querySelector(".search");
            searchInput.value = searchKey;

            searchInput.addEventListener("focusin", handler.searchBarFocused);
            searchInput.addEventListener("focusout", handler.searchBarUnFocused);
            searchInput.addEventListener("keyup", e => { handler.searchKeyPressed(this, e) });

            let addProjectBtn = root.querySelector(".addProjectContainer .icon");
            addProjectBtn.addEventListener("click", e => {handler.addProjectBtnClicked(this, projects, e)});

            initialRender = false;
        }
    };

    /**
     * Gets the UUID of the current selected project
     * @returns {?string} The UUID of the selected project
     */
    function currentProject() {
        return selected;
    }

    let component = (function() {
        return {
            projects,
            searchKey,
            setSearchKey,
            select,
            render,
            currentProject,
            _createProjectNodes
        };
    })();

    return component;
};