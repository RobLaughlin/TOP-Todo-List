import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { sidebar, createTestProjects } from "./Sidebar";

// Create test projects
let {projects, selected} = createTestProjects(5, 5);

let root = document.getElementsByClassName("sidebar")[0];
let sidebarNode = sidebar(projects);
sidebarNode.render(root);