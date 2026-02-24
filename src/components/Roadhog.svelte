---
import roadhog_normal from "../assets/images/roadhog_normal.gif"
---
<div id="roadhog" class="unselectable" class:hogJumping={hogJumping}>
    <div bind:this={dialogue} class:visible={visibleDialogue}  id="hogDialog" class="undraggable"></div>
    <div class="entity" style="position: relative">    
        <!-- <span id="audioButton" class="material-symbols-outlined" data-toggle="modal" data-target="#exampleModalLong"></span> -->
        <button class="button" on:click={onRoadhogClick}>
            <img bind:this={roadhog} draggable="false" alt="roadhog" id="roadhogImage" src={roadhog_normal.src}>
        </button>
        <audio bind:this={roadhogAudio}></audio>
    </div>
</div>

<script lang="ts">
    import { onMount, tick } from "svelte";
    import { onRoadhogMessage, onRoadhogJump, onStopMessage } from "../assets/scripts/roadhog";
    import roadhog_normal from "../assets/images/roadhog_normal.gif"
    import { randInt } from "../assets/scripts/utils"
    

    //const roadhog = document.getElementById("roadhog")!
    //const dialogue = document.getElementById("hogDialog")!
    let roadhog : HTMLElement;
    let dialogue : HTMLElement;
    let roadhogAudio: HTMLAudioElement;


    let visibleDialogue = false
    let hogJumping = false

    onRoadhogMessage.subscribe((message) => {
        showMessage(message.msg, message.time)
    })

    onRoadhogJump.subscribe(() => {
        jump()
    })

    onStopMessage.subscribe(() => {
        stopMessage()
    })

    onMount(() => {
        onRoadhogMessage.emit({
            msg: "Welcome to my website!",
            time: 3000
        });
        
        document.addEventListener("mouseover", (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const closestMessage = target.closest<HTMLElement>("*[data-hog-message]");
            if (closestMessage) {
                const message = closestMessage.getAttribute("data-hog-message");
                if (message) {
                    onRoadhogMessage.emit({ msg: message, time: 1000 });
                }
            } 
        }, false);
    })


    let oldMessageInterval: number | undefined;   
    function showMessage(message: string, time: number)
    {
        clearTimeout(oldMessageInterval);
        jump();
        dialogue.textContent = message;
        //dialogue.classList.add("visible")
        visibleDialogue = true
        
        oldMessageInterval = setTimeout(() => {
            onStopMessage.emit()
        }, time);
    }


    function onRoadhogClick()
    {
        playRandomAudio()
        onRoadhogJump.emit()
    }
    

    function playRandomAudio()
    {
        jump()
        if (!roadhogAudio.paused) roadhogAudio.pause();
        const audioType = randInt(10)
        if(roadhogAudio != null)
        roadhogAudio.src = `/audio/shittalking/audio${audioType}.mp3`
        roadhogAudio?.play();
            
    }

    async function jump()
    {
        hogJumping = false
        setTimeout(() => {
            hogJumping = true
        }, 0)
        
    }

    function stopMessage()
    {
        hogJumping = false
        visibleDialogue = false
        oldMessageInterval = undefined;
    }




    
</script>


<style>
    .undraggable
    {
        -moz-window-dragging: no-drag;
        -webkit-user-drag: none;
        
        pointer-events: none;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        user-select: none;
    }


    .unselectable
    {
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        user-select: none;

        -moz-window-dragging: no-drag;
        -webkit-user-drag: none;
    }

    #roadhog
    {
        display: flex;
        flex-direction: column;
        width: 20%;
        position: fixed;
        bottom: 0px;
        left: 0px;
        min-width: 130px;
        max-width: 220px;
        z-index: 500;
    }

    #roadhog > .entity > .button
    {
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
    }

    #roadhogImage
    {
        width: 100%;
        margin: 0px auto;
        display: block;
        filter: drop-shadow(-10px 2px 14px #353535);
    }


    .hogJumping
    {
        animation: hogJump .56s ease-in-out forwards;
    }

    #hogDialog
    {
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
        transition: all 0.2s ease-in;
    }

    #hogDialog.visible
    {
        opacity: 1;
        scale: 1;
    }


    @keyframes r
    {
        from
        {
            transform: rotate(0deg);
        }
        to
        {
            transform: rotate(360deg);
        }
    }

    @keyframes throwHook {
        from{
            height: 0px;
        }
        to
        {
            height: var(--longness);
        }
    }

    @keyframes hogJump {
    
        20%,
        60% {
            transform: translateY(-10px);
        }
        40%,
        80% {
            transform: translateY(0px)
        }
    }

</style>