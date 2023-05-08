<script>
    import {predicates, selectedPredicates} from "./stores/rdfStore";

    function handleCheckboxChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            selectedPredicates.set([...$selectedPredicates, value]);
        } else {
            selectedPredicates.set($selectedPredicates.filter((predicate) => predicate !== value));
        }
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
