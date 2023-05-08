<script>

    import * as d3 from "d3";
    import {fetchedData} from "./stores/rdfStore";
    import FilterComponent from "./FilterComponent.svelte";

    let svg;

    let d3Graph;

    let selectedPredicates = [];

    $: selectedPredicates, $fetchedData, makeSvg();

    function makeSvg(){
        if ($fetchedData === undefined){
            return
        }

        console.log(selectedPredicates)
        console.log("asd")
        d3Graph = $fetchedData;

        console.log(d3Graph)

        const filteredNodes = d3Graph.nodes.filter((node) =>
            selectedPredicates.includes(node.predicate)
        );
        const filteredLinks = d3Graph.links.filter((link) =>
            selectedPredicates.includes(link.label)
        );

        console.log(filteredNodes)
        console.log(filteredLinks)

        const width = 1900;
        const height = 1000;

        svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

        const simulation = d3.forceSimulation(d3Graph.nodes)
            .force("link", d3.forceLink(d3Graph.links).id(d => d.id).distance(300))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .selectAll("line")
            .data(d3Graph.links)
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", "1px");

        const node = svg.append("g")
            .selectAll("circle")
            .data(d3Graph.nodes)
            .enter()
            .append("circle")
            .attr("r", 50)
            .attr("fill", d => { // use a function to set the fill color based on the node type
                if (d.type === "SUBJECT") {
                    return "blue";
                } else if (d.type === "OBJECT") {
                    return "red";
                } else {
                    return "#fff";
                }
            })
            .attr("stroke", "#000")
            .attr("stroke-width", "1px")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        const label = svg.append("g")
            .selectAll("text")
            .data(d3Graph.nodes)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.1em")
            .attr("fill", "#000")
            .text(d => {
                return d.id.replace(new RegExp("http://dbpedia.org/resource/", "g"), "")
            });

        const labelLink = svg.append("g")
            .selectAll("text")
            .data(d3Graph.links)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.1em")
            .attr("fill", "#000")
            .text(d => {
                return d.label.replace(new RegExp("http://dbpedia.org/ontology/", "g"), "")
            });

        node.append("title")
            .text(d => d.id);

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            labelLink
                .attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2)

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        console.log("svg is ", svg)
    }



</script>

<FilterComponent on:predicatesSelected="{event => selectedPredicates = event.detail}" />


<svg></svg>
