<script>
    import {fetchTTL} from "./fetchTTL";

    let urlPart = ""
    let url = "https://dbpedia.org/data/Lionel_Messi.ttl"

</script>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .input-field {
        margin-right: 10px;
    }
</style>

<div class="container">
    <div class="input-field">
        <input style="width: 400px" bind:value={url} />
    </div>
    <button on:click={fetchTTL(url)}>Fetch</button>
</div>