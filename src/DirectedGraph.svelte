<script>
    import * as d3 from "d3";
    import {fetchedData, selectedPredicates} from "./stores/rdfStore";
    import {fetchTTL} from "./fetchTTL";

    let svg;

    let d3Graph;

    selectedPredicates

    $: $selectedPredicates, $fetchedData, makeSvg();

    function makeSvg(){
        if ($fetchedData === undefined){
            return
        }

        // Clear existing SVG
        if (svg) {
            svg.selectAll('*').remove();
        }

        d3Graph = $fetchedData;

        const filteredNodesMap = new Map(); // To store unique nodes

        d3Graph.nodes.forEach((node) => {
            const nodePredicates = node.predicate.split(',').map((p) => p.trim());
            const hasMatchingPredicate = nodePredicates.some((p) =>
                $selectedPredicates.includes(p)
            );
            if (hasMatchingPredicate) {
                filteredNodesMap.set(node.id, node);
            }
        });

        const filteredNodes = Array.from(filteredNodesMap.values());

        const filteredLinks = d3Graph.links.filter((link) =>
            $selectedPredicates.includes(link.label)
        );

        const width = 1400;
        const height = 1000;

        svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

        svg
            .append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-5 -5 10 10")
            .attr("refX", 25)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 25)
            .attr("markerHeight", 25)
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#999");

        const simulation = d3.forceSimulation(filteredNodes)
            .force("link", d3.forceLink(filteredLinks).id(d => d.id).distance(300))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .selectAll("line")
            .data(filteredLinks)
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", "1px")
            .attr("marker-end", "url(#arrowhead)"); // Add the arrow marker to the links

        const node = svg.append("g")
            .selectAll("circle")
            .data(filteredNodes.filter(d => d.type === "SUBJECT" || d.type === "OBJECT"))
            .enter()
            .append("circle")
            .attr("r", 50)
            .attr("fill", d => {
                if (d.type === "SUBJECT") {
                    return "#FF6B6B";
                } else if (d.type === "OBJECT") {
                    return "#6BB5FF";
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
            )
            .on("dblclick", (event, d) => {
                handleDoubleClick(d);
            });

        const literalNode = svg.append("g")
            .selectAll("rect")
            .data(filteredNodes.filter(d => d.type === "LITERAL")) // Filter for literal nodes
            .enter()
            .append("rect")
            .attr("width", 100)
            .attr("height", 100)
            .attr("fill", "#66FF99")
            .attr("stroke", "#000")
            .attr("stroke-width", "1px")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )
            .on("dblclick", (event, d) => {
                handleDoubleClick(d);
            });

        const label = svg.append("g")
            .selectAll("text")
            .data(filteredNodes)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.1em")
            .attr("fill", "#000")
            .text(d => d.label);

        const labelLink = svg.append("g")
            .selectAll("text")
            .data(filteredLinks)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.1em")
            .attr("fill", "#000")
            .text(d => {
                return d.label.replace(new RegExp("http://dbpedia.org/ontology/", "g"), "")
            });

        node.append("title")
            .text(d => d.label);

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

            literalNode
                .attr("x", d => d.x - 50)
                .attr("y", d => d.y - 50);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

    }

    function handleDoubleClick(d){
        let url = d.id
        url = url.replace(new RegExp("/resource/", "g"), "/data/")
        fetchTTL(url+".ttl")
    }

</script>

<svg></svg>
