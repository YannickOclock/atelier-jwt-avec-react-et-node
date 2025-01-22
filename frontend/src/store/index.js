import { create } from 'zustand'

// ---------- PARTIE USER ----------------------------

export const useUserStore = create((set) => ({
    user: null,
    login: (username, password) => set(() => ({
        // todo : plus tard, j'irai faire ici un appel à fetch
        // pour tester le username, password dans la bdd
        // on pourra aussi gérer les erreurs, etc.
        user: { name: username }
    })),
    logout: () => set({ user: null }),
}))





// ------------ PARTIE PROJETS ------------------------

import projects from './projects'

/**
 * Récupérer la liste des projets
 * @returns la liste des projets
 */
export const getProjects = () => {
    return [...projects]
}

/**
 * Récupérer un projet via son id
 * @param {number} id l'id du projet
 * @returns un projet
 */
export const getProjectById = (id) => {
    return projects.find((project) => project.id === id)
}