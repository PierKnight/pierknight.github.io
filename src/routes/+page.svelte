<script lang="ts">
    import Roadhog from "$lib/components/roadhog.svelte";
    import { onMount } from "svelte";

    let roadhog: Roadhog

    onMount(() => {
        roadhog.showMessage("SOS", 1000)
    })

</script>
<Roadhog bind:this={roadhog}></Roadhog>