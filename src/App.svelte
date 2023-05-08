<script>
  import * as rdfx from 'rdflib'
  import DirectedGraph from "./DirectedGraph.svelte";
  import FetchTTL from "./FetchTTL.svelte";
  import {fetchedData} from "./stores/rdfStore";
  import FilterComponent from "./FilterComponent.svelte";

  let graph = rdfx.graph();

  let d3Graph = null;

  async function asdg() {
    await fetch('/example.ttl')
            .then(response => response.text())
            .then(data => {
              rdfx.parse(data, graph, 'http://localhost:5173', 'text/turtle');
            });

      const nodes = [];
      const links = [];

      graph.match().forEach((quad) => {
          // Add the subject node to the nodes array
          const subject = quad.subject.value;
          if (!nodes.find((node) => node.id === subject)) {
              nodes.push({ id: subject, label: subject });
          }

          // Add the object node to the nodes array
          const object = quad.object.value;
          if (!nodes.find((node) => node.id === object)) {
              nodes.push({ id: object, label: object });
          }

          // Add the link to the links array
          links.push({
              source: subject,
              target: object,
              label: quad.predicate.value,
          });
      });

      d3Graph = { nodes, links };

      console.log(d3Graph)


  }


</script>


<div>
    <FetchTTL/>
</div>


<div>
    <DirectedGraph/>
</div>

<div>
    <FilterComponent/>
</div>

