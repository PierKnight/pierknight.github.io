<div id="roadhog" class="unselectable">
    <p bind:this={dialogue} class:visible={visibleDialogue} id="hogDialog" class="undraggable"></p>
    <div class="entity" style="position: relative">
        <button class="button" onclick={onRoadhogClick}>
            <img bind:this={roadhog} draggable="false" alt="roadhog" id="roadhogImage" src={roadhog_normal}>

            {#if thinking}
            <div transition:fade={{duration: 100}} class="absolute pointer-events-none grid top-1 right-1/6 place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
                <svg class="text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24">
                    <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
                    </path>
                </svg>
            </div>
            {/if}
        </button>
        <audio bind:this={roadhogAudio} crossorigin="anonymous"></audio>
    </div>

</div>

<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import roadhog_normal from "$images/roadhog_normal.gif";
    import { randInt } from "$assets/lib/utils";
    import { loadVoiceLines, type Voiceline } from "$assets/lib/overwatchvl";
    import { animate, JSAnimation, createAnimatable, spring, splitText, stagger } from 'animejs';

    let roadhog: HTMLElement;
    let dialogue: HTMLElement;
    let roadhogAudio: HTMLAudioElement;
    let visibleDialogue = $state(false);
    let thinking = $state(false)
    let roadhogVoiceLines: Voiceline[];
    let audioCtx: AudioContext;
    let { jumpHeight = 0.1 }: { jumpHeight?: number } = $props();
    let jumpAnimation: JSAnimation;
    let oldMessageInterval: number | undefined;

    onMount(() => {
        setupMessageHover();
        setupAudioContext();
        loadVoiceLines().then(voicelines => roadhogVoiceLines = voicelines);
    });

    // --- Event Handlers ---
    function onRoadhogClick() {
        playRandomAudio();
    }

    function playRandomAudio() {
        if (roadhogVoiceLines) {
            const voiceline = roadhogVoiceLines[randInt(roadhogVoiceLines.length)];
            playAudio(voiceline.url);
        }
    }

    export function jump() {
        jumpAnimation?.reset();
        jumpAnimation = animate("#roadhog", {
            keyframes: [
                { scaleY: 0.8, scaleX: 1.25, duration: 120, easing: 'easeInQuad' },
                { translateY: "-20%", scaleY: 1.1, scaleX: 0.9, duration: 400, easing: 'easeOutQuad' },
                { scaleY: 1, scaleX: 1, duration: 100, easing: 'easeOutQuad' },
                { translateY: 0, duration: 200, easing: 'easeInQuad' },
                { scaleY: 0.85, scaleX: 1.17, duration: 120, easing: 'easeOutQuad' },
                { scaleY: 1, scaleX: 1, duration: 150, ease: spring({ bounce: 0.77, duration: 302 }) }
            ],
            playbackRate: 2.0,
            autoplay: false
        });
        jumpAnimation.play();
    }

    export async function showMessage(message: string, time: number, shouldJump: boolean = true) {
        clearTimeout(oldMessageInterval);
        if (shouldJump) jump();
        visibleDialogue = true;
        dialogue.textContent = message;

        const { chars } = splitText(dialogue, { chars: true });
        animate(chars, { y: ['0rem', '-1rem', '0rem'], loop: true, autoplay: true, delay: stagger(100) });

        oldMessageInterval = setTimeout(() => {
            visibleDialogue = false;
        }, time);
    }

    export function playAudio(audioSrc: string) {
        if (!roadhogAudio.paused) roadhogAudio.pause();
        audioCtx.resume();
        roadhogAudio.src = audioSrc;
        roadhogAudio.play();
    }

    // --- Setup Functions ---
    function setupMessageHover() {
        document.addEventListener("mouseover", (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;
            const closestMessage = target.closest<HTMLElement>("*[data-hog-message]");
            if (closestMessage) {
                const message = closestMessage.getAttribute("data-hog-message");
                if (message) showMessage(message, 5000);
            }
        });
    }

    function setupAudioContext() {
        audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        audioCtx.createMediaElementSource(roadhogAudio).connect(analyser);
        analyser.connect(audioCtx.destination);

        const roadhogPixelHeight = roadhog.offsetHeight;
        const animatable = createAnimatable(roadhog, { translateY: 0 });
        let animationId: number;

        function animateAudio() {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum = Math.max(dataArray[i], sum);
            const val = sum / 255;
            animatable.translateY(val * -roadhogPixelHeight * jumpHeight);
            animationId = requestAnimationFrame(animateAudio);
        }

        roadhogAudio.addEventListener("playing", () => {
            animateAudio();
            animatable.animations = { translateY: 0 };
            thinking = false
        });

        roadhogAudio.addEventListener("ended", () => {
            cancelAnimationFrame(animationId);
            animate(roadhog, { translateY: "0", duration: 1000, ease: 'out(7.1)' });
        });

        roadhogAudio.addEventListener("waiting", () => {
            thinking = true
        })
        
    }
</script>

<style>
    /* --- Utility Classes --- */
    .undraggable {
        -moz-window-dragging: no-drag;
        -webkit-user-drag: none;
        pointer-events: none;
        user-select: none;
    }

    .unselectable {
        user-select: none;
        -moz-window-dragging: no-drag;
        -webkit-user-drag: none;
    }

    /* --- Container --- */
    #roadhog {
        display: flex;
        flex-direction: column;
        width: 20%;
        position: fixed;
        bottom: 0;
        left: 0;
        min-width: 130px;
        max-width: 220px;
        z-index: 500;
    }

    /* --- Button & Image --- */
    #roadhog > .entity > .button {
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
    }

    #roadhogImage {
        width: 100%;
        display: block;
        margin: 0 auto;
        filter: drop-shadow(-10px 2px 14px #353535);
    }

    /* --- Dialogue --- */
    #hogDialog {
        word-wrap: break-word;
        text-align: center;
        padding: 10px;
        border-style: groove;
        border-radius: 5px;
        border-width: 2px;
        border-color: black;
        background-color: white;
        opacity: 0;
        scale: 0;
        z-index: 1;
        transition: all 0.2s linear(0, 0.008 1.1%, 0.034 2.3%, 0.134 4.9%, 0.264 7.3%, 0.683 14.3%, 0.797 16.5%, 0.89 18.6%, 0.967 20.7%, 1.027 22.8%, 1.073 25%, 1.104 27.3%, 1.123 30.6%, 1.119 34.3%, 1.018 49.5%, 0.988 58.6%, 0.985 65.2%, 1 84.5%, 1);
    }

    #hogDialog.visible {
        opacity: 1;
        scale: 1;
    }

    /* --- Animations --- */
    @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    @keyframes throwHook { from { height: 0px; } to { height: var(--longness); } }
</style>