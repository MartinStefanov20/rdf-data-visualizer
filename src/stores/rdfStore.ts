import { writable } from 'svelte/store';


export const fetchedData = writable({
    nodes: [],
    links: []
})

export const predicates = writable([])

export const selectedPredicates = writable([])