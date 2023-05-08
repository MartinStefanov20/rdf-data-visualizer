<script>
    import { onMount } from 'svelte';
    import * as rdfx from 'rdflib'
    import {fetchedData, predicates} from "./stores/rdfStore";


    let urlPart = ""
    let url = "https://dbpedia.org/data/"

    async function fetchTTL() {
        console.log("fetching")
        const response = await fetch(url+urlPart+".ttl");
        const ttl = await response.text();
        let graph = rdfx.graph()

        rdfx.parse(ttl, graph, url+urlPart+".ttl", 'text/turtle');
        console.log("Graph in fetchTTL")

        console.log(graph);

        const nodes = [];
        const links = [];
        let counter = 0

        const predicatesList = [];

        graph.match().forEach((quad) => {
            // Add the subject node to the nodes array
            if (counter > 2000){
                return
            }

            const predicate = quad.predicate.value

            const subject = quad.subject.value;
            if (!nodes.find((node) => node.id === subject && node.type === "SUBJECT")) {
                nodes.push({ id: subject, label: subject, type: "SUBJECT", predicate: predicate });
            }

            // Add the object node to the nodes array
            const object = quad.object.value;
            if (!nodes.find((node) => node.id === object && node.type === "OBJECT")) {
                nodes.push({ id: object, label: object, type: "OBJECT", predicate: predicate });
            }

            // Add the link to the links array
            links.push({
                source: subject,
                target: object,
                label: quad.predicate.value,
            });

            if (!predicatesList.find((d) => d === predicate)){
                predicatesList.push(predicate)
            }
            counter++;
        });

        predicates.set(predicatesList)

        fetchedData.set({nodes, links})


    }

</script>

<input bind:value={urlPart}>
<button on:click={fetchTTL}>Fetch</button>


<!--{#if $asd}-->
<!--    {#each $asd.nodes as node}-->
<!--        <p>{node.label}</p>-->
<!--    {/each}-->
<!--{/if }-->