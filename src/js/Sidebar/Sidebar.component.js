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

    /**
     * Generates sidebar HTML
     * @method html
     * @returns {string} The sidebar HTML string
     */
    function html() {
        let sidebarTemplateNode = document.createElement("template");
        sidebarTemplateNode.innerHTML = template.sidebar();
        let sidebarNode = sidebarTemplateNode.content.querySelector("div");
        
        // Implement add todo modal
        let addTodoModalTemplateNode = document.createElement("template");
        addTodoModalTemplateNode.innerHTML = template.addTodoModal();

        // Implement behaviour for the add todo modal submit button
        let addTodoModalNode = addTodoModalTemplateNode.content.querySelector("div");
        let addTodoBtn = addTodoModalNode.querySelector("#AddTodoBtn");
        addTodoBtn.addEventListener("click", e => { handler.addTodoSubmitClicked(this, projects, e) });

        // Implement behaviour for the close button in the todo modal
        let closeBtn = addTodoModalNode.querySelector("#TodoCloseBtn");
        closeBtn.addEventListener("click", handler.addTodoCloseClicked);
        
        sidebarNode.appendChild(addTodoModalNode);

        // Implement search bar behaviour
        let searchInput = sidebarNode.querySelector(".search");
        searchInput.addEventListener("focusin", handler.searchBarFocused);
        searchInput.addEventListener("focusout", handler.searchBarUnFocused);
        searchInput.addEventListener("keyup", handler.searchKeyPressed);

        // Inject projects and todos
        for (let p = 0; p < projects.length; p++) {
            let project = projects[p];
    
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
            sidebarNode.appendChild(itemContainer);
        }

        let addProjectTemplate = document.createElement("template");
        addProjectTemplate.innerHTML = template.addProject();
        let addProjectNode = addProjectTemplate.content.querySelector("div");
        
        let addProjectBtn = addProjectNode.querySelector(".icon");
        addProjectBtn.addEventListener("click", e => {handler.addProjectBtnClicked(this, projects, e)});

        sidebarNode.appendChild(addProjectNode);
        return sidebarNode;
    };

    /**
     * Replaces the given root node with the sidebar component HTML
     * @method render
     */
    function render() {
        let root = document.getElementsByClassName("sidebar")[0];
        root.replaceWith(this.html());
    };

    /**
     * Gets the UUID of the current selected project
     * @returns {?string} The UUID of the selected project
     */
    function currentProject() {
        return selected;
    }

    return (() => {
        return {
            projects,
            select,
            html,
            render,
            currentProject
        };
    })();
};