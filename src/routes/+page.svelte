<script lang="ts">
    import Roadhog from "$components/roadhog.svelte";
    import { onMount } from "svelte";
    

    let roadhog: Roadhog

    onMount(() => {
        roadhog.showMessage("Welcome to my website!", 3000)
    })

</script>


<svelte:head>
    <title>Pierknight Website!</title> 
</svelte:head>

<Roadhog bind:this={roadhog}></Roadhog>


