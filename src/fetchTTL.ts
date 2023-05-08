import * as rdfx from "rdflib";
import {fetchedData, predicates} from "./stores/rdfStore";

export async function fetchTTL(url){
    const response = await fetch(url);
    const ttl = await response.text();
    let graph = rdfx.graph()

    rdfx.parse(ttl, graph, url, 'text/turtle');

    let nodes = [];
    fetchedData.subscribe((data) => nodes = data.nodes);
    let links =[];
    fetchedData.subscribe((data) => links = data.links);

    let predicatesList = [];
    predicates.subscribe((data) => predicatesList = data)

    console.log('asd', url)


    graph.match().forEach((quad) => {

        const predicate = quad.predicate.value


        //Add the subject node
        const subject = quad.subject.value;
        const subjectNode = nodes.find((node) => node.id === subject && node.type === 'SUBJECT')
        if (subjectNode){
            subjectNode.predicate += `, ${predicate}`
        } else {
            nodes.push({ id: subject, label: subject, type: "SUBJECT", predicate: predicate });
        }


        // Add the object node to the nodes array
        const object = quad.object.value;
        const objectNode = nodes.find((node) => node.id === object && node.type === "OBJECT")
        if (objectNode){
            objectNode.predicate += `, ${predicate}`
        } else {
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
    });

    predicates.set(predicatesList)

    fetchedData.set({nodes, links})

}