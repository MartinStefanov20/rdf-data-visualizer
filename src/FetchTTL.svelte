<script>
    import {fetchTTL} from "./fetchTTL";

    let urlPart = ""
    let url = "https://dbpedia.org/data/"

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
    <button on:click={fetchTTL(url+urlPart+".ttl")}>Fetch</button>
</div>