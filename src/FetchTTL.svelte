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

            const predicate = quad.predicate.value

            const subject = quad.subject.value;
            const subjectNode = nodes.find((node) => node.id === subject && node.type === 'SUBJECT')
            if (subjectNode){
                subjectNode.predicate += `, ${predicate}`
            } else {
                nodes.push({ id: subject, label: subject, type: "SUBJECT", predicate: predicate });
            }





            // if (!nodes.find((node) => node.id === subject && node.type === "SUBJECT" && node.predicate === predicate)) {
            //     nodes.push({ id: subject, label: subject, type: "SUBJECT", predicate: predicate });
            // }


            // Add the object node to the nodes array
            const object = quad.object.value;
            const objectNode = nodes.find((node) => node.id === object && node.type === "OBJECT")
            if (objectNode){
                objectNode.predicate += `, ${predicate}`
            } else {
                nodes.push({ id: object, label: object, type: "OBJECT", predicate: predicate });
            }
            // if (!nodes.find((node) => node.id === object && node.type === "OBJECT"  && node.predicate === predicate)) {
            //
            //     nodes.push({ id: object, label: object, type: "OBJECT", predicate: predicate });
            // }

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

<style>
    .container {
        display: flex; /* Use flexbox to create a horizontal layout */
        align-items: center; /* Center the items vertically within the container */
        justify-content: center;
    }

    .input-field {
        margin-right: 10px; /* Add some spacing between the input field and the button */
    }
</style>

<div class="container">
    <div class="input-field">
        <input bind:value={urlPart} />
    </div>
    <button on:click={fetchTTL}>Fetch</button>
</div>