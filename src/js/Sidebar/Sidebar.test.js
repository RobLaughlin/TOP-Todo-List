import { Project, Todo } from "../Todos";

/**
 * @module Sidebar/Test
 */

/**
 * Generates a number of projects and todos to use as test data
 * @param {number} numProjects The number of projects to generate 
 * @param {number} numTodos The number of todos to generate within each project
 * @returns {Project[]} The array of test projects generated
 */
export const createTestProjects = (numProjects, numTodos) => {
    let projects = []
    for (let i = 0; i < numProjects; i++) {
        let project = new Project(`Project ${i}`, []);
        for (let j = 0; j < numTodos; j++) {
            project.add(new Todo(`Todo ${j}`, "description", new Date(), j, "notes"));
        }
        projects.push(project);
    }

    const selected = numProjects >= 1 ? projects[0].uuid : null;
    return { projects, selected };
};