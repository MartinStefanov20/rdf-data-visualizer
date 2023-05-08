<script>
    import { createEventDispatcher } from 'svelte';
    import {predicates} from "./stores/rdfStore";


     // List of available predicates
    let selectedPredicates = [];

    const dispatch = createEventDispatcher();

    function handleCheckboxChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            selectedPredicates = [...selectedPredicates, value];
        } else {
            selectedPredicates = selectedPredicates.filter((predicate) => predicate !== value);
        }
        dispatch('predicatesSelected', selectedPredicates);
    }
</script>

{#if $predicates}
<div>
    {#each $predicates as predicate}
        <label>
            <input
                    type="checkbox"
                    checked={selectedPredicates.includes(predicate)}
                    value={predicate}
                    on:change={handleCheckboxChange}
            />
            {predicate}
        </label>
    {/each}
</div>
{/if}
