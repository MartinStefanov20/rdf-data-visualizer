<script>
    import { predicates, selectedPredicates } from "./stores/rdfStore";

    let selectedUrlPart = "";
    let filteredPredicates = [];

    function handleDropdownChange(event) {
        selectedUrlPart = event.target.value;
    }

    $: {
        filteredPredicates = $predicates.filter(predicate => {
            return predicate.startsWith(selectedUrlPart);
        });
    }

    function handleCheckboxChange(event) {
        const {value, checked} = event.target;
        if (checked) {
            let index = value.indexOf(", ") + 2;
            let result = value.slice(index);
            selectedPredicates.set([...$selectedPredicates, result]);
        } else {
            selectedPredicates.set($selectedPredicates.filter((predicate) => {
                let index = value.indexOf(", ") + 2;
                let result = value.slice(index);
                return predicate !== result;
            }));
        }
    }
</script>

<div>
    <label for="urlPartDropdown">Select urlPart: </label>
    <select id="urlPartDropdown" bind:value={selectedUrlPart} on:change={handleDropdownChange}>
        {#each Array.from(new Set($predicates.map(predicate => predicate.slice(0, predicate.indexOf(", "))))) as urlPart}
            <option value={urlPart}>{urlPart}</option>
        {/each}
    </select>
</div>

<div>
    <ul>
        {#each filteredPredicates as predicate}
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
