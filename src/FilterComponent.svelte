<script>
    import { createEventDispatcher } from 'svelte';
    import {predicates, selectedPredicates} from "./stores/rdfStore";


     // List of available predicates

    const dispatch = createEventDispatcher();

    function handleCheckboxChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            selectedPredicates.set([...$selectedPredicates, value]);
        } else {
            selectedPredicates.set($selectedPredicates.filter((predicate) => predicate !== value));
        }
        // dispatch('predicatesSelected', selectedPredicates);
    }
</script>

{#if $predicates}
<div>
    <ul>
        {#each $predicates as predicate}
            <li>
            <label>
                <input
                        type="checkbox"
                        checked={$selectedPredicates.includes(predicate)}
                        value={predicate}
                        on:change={handleCheckboxChange}
                />
                {predicate}
            </label>
            </li>
        {/each}
    </ul>
</div>
{/if}
