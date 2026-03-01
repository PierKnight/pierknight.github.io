<script lang="ts">
    import Roadhog from "$components/roadhog.svelte";
    import favicon from "$assets/favicon.png"
    import { onMount } from "svelte";
    

    let roadhog: Roadhog
    let music: HTMLVideoElement

    onMount(() => {
        roadhog.showMessage("Welcome to my website!", 3000)
    })

</script>


<svelte:head>
    <title>Pierknight Website!</title> 
</svelte:head>


<img src={favicon} alt="website icon">

<Roadhog bind:this={roadhog} useVolume={true}></Roadhog>


<style>
    
</style>

