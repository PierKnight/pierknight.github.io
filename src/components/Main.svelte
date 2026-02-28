

<div id="container">

	
	<main>
		<Roadhog bind:this={roadhog}></Roadhog>
	</main>


</div>

<script lang="ts">
    import { onMount } from "svelte";


	import Roadhog from "./Roadhog.svelte";

	let roadhog: Roadhog


	
</script>
