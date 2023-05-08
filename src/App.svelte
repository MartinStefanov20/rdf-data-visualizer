<script>
  import DirectedGraph from "./DirectedGraph.svelte";
  import FetchTTL from "./FetchTTL.svelte";
  import FilterComponent from "./FilterComponent.svelte";

</script>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .main-container {
        flex: 1;
        display: flex;
    }

    .graph-container {
        flex: 4;
        padding: 20px;
    }

    .filter-container {
        flex: 1;
        padding: 20px;
    }
</style>

<div class="app-container">
    <FetchTTL />
    <div class="main-container">
        <div class="graph-container">
            <DirectedGraph />
        </div>
        <div class="filter-container">
            <FilterComponent />
        </div>
    </div>
</div>

