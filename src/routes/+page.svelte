<script lang="ts">
    import Roadhog from "$components/roadhog.svelte";
    import favicon from "$assets/favicon.png"
    import { onMount } from "svelte";
    import { animate, splitText, stagger, onScroll } from 'animejs';
        
    let roadhog: Roadhog

    const copyright = `Copyright - © - Pierknight - 2026-${new Date().getFullYear()}`

    

    onMount(() => {
        roadhog.showMessage("Welcome to my website!", 3000)



        const { chars } = splitText('h1', { words: false, chars: true });

        animate(chars, {
            y: [
                { to: '-1rem', ease: 'outExpo', duration: 600 },
                { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
            ],
            rotate: {
                from: '-1turn',
                delay: 0
            },
            delay: stagger(50),
            ease: 'inOutCirc',
            loopDelay: 1000,
            loop: true
        });
        
        animate('.square', {
            opacity: ['0', '1'],
            x: ['-50vw', 0],
            rotate: '1turn',
            duration: 1000,
            autoplay: onScroll({
                debug: false,
            })
        });

        

    })

</script>


<svelte:head>
    <title>Pierknight Website!</title> 
</svelte:head>




 <div class="bg-linear-180 from-bg from-50% to-secondary overflow-y-auto bg-cover bg-center back y-100">

    <div class="scroll-container"></div>

    <div class="text-center flex flex-col items-center">

        <h1 class="mt-10 mb-4 text-6xl">Pierknight</h1>
        <img class="shadow-2xl border-secondary border-4 items-center rounded-xl w-[max(20vw,200px)]" src={favicon} alt="website icon">
        <p class="mt-6 text-2xl">A website made by me because why not</p>
        <p class="square mt-100 mb-20 text-5xl">This is test</p>
    </div>
    

    <footer class="align-middle text-center pt-2.5 pb-2.5 bg-thirth">
        <p>{copyright}</p>
    </footer>
    <!-- <div style="width: 100px; height: 100px; left: 30%; top: 100%;" class="bg-white absolute"></div> -->
        


 </div>

<Roadhog bind:this={roadhog}></Roadhog>

