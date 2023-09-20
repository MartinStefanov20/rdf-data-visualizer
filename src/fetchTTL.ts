import * as rdfx from "rdflib";
import {fetchedData, predicates, predicateLabels} from "./stores/rdfStore";

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

    var parts = url.split("/").filter(Boolean); // Filter to remove empty elements

    let urlPart = parts[parts.length - 1];

    graph.match().forEach((quad) => {

        let predicate = quad.predicate.value

        if (predicateLabels[predicate]){
            predicate = predicateLabels[predicate]
        }

        const subject = quad.subject.value;
        const subjectNode = nodes.find((node) => node.id === subject && node.type === 'SUBJECT')
        const quadObject = quad.object
        let object = quad.object.value;
        const objectNode = nodes.find((node) => node.id === object && node.type === "OBJECT")

        //Add the subject node
        if (predicate == "http://www.w3.org/2000/01/rdf-schema#label") {
            if (quadObject.language == "en") {
                if (subjectNode) {
                    subjectNode.label = quadObject.value
                    subjectNode.predicate += `, ${predicate}`
                } else {
                    nodes.push({id: subject, label: quadObject.value, type: "SUBJECT", predicate: predicate});
                }
            }
        } else {
            if (subjectNode){
                subjectNode.predicate += `, ${predicate}`
            } else {
                nodes.push({ id: subject, label: subject, type: "SUBJECT", predicate: predicate });
            }
        }


        // Add the object node to the nodes array
        if (predicate == "has abstract"){
            if (quadObject.language == "en") {
                if (object.length > 40) {
                    object = object.substring(0, 40) + "...";
                } else {
                    // If the string is already 20 characters or shorter, no need to trim
                    object = object;
                }
                if (objectNode){
                    objectNode.predicate += `, ${predicate}`
                } else {
                    if(quadObject.termType == "Literal") {
                        nodes.push({ id: object, label: object, type: "LITERAL", predicate: predicate });
                    }
                    else {
                        nodes.push({id: object, label: object, type: "OBJECT", predicate: predicate});
                    }
                }
                // Add the link to the links array
                links.push({
                    source: subject,
                    target: object,
                    label: predicate,
                });
                console.log("aaa ", object)
            }
        } else {

            if (objectNode){
                if (objectNode.id == "http://dbpedia.org/resource/Skopje"){
                    objectNode.label = "Skopje"
                }
                objectNode.predicate += `, ${predicate}`
            } else {
                if(quadObject.termType == "Literal") {
                    nodes.push({ id: object, label: object, type: "LITERAL", predicate: predicate });
                }
                else {
                    nodes.push({id: object, label: object, type: "OBJECT", predicate: predicate});
                }
            }
            // Add the link to the links array
            links.push({
                source: subject,
                target: object,
                label: predicate,
            });
        }

        if (!predicatesList.find((d) => {
            let index = d.indexOf(", ") + 2;
            let result = d.slice(index);
            return result === predicate;
        })){
            predicatesList.push(`${urlPart}, ${predicate}`)

        }
    });

    predicates.set(predicatesList)

    fetchedData.set({nodes, links})

}