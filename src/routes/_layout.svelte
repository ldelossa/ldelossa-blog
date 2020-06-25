<script>
    import Sidebar from "../components/sidebar/Sidebar.svelte";
	import { fly, fade, slide } from 'svelte/transition';
    import {quintOut} from 'svelte/easing';



    let author = "Louis DeLosSantos";
    let github_url = "https://github.com/ldelossa";
    let linkedin_url = "https://www.linkedin.com/in/louisdelossantos/";
    let twitter_url = "https://twitter.com/ldelossa_ld";

    let full = true;
    /* when the nav is hidden change our css class
       to full */
    function handleNavToggled(event) {
        full = event.detail.visible ? false : true
    }

    /* if media query is true clicking on icons will
       hide the sidebar automatically */
    function handleNavClick(event){
        const mq = window.matchMedia("(max-width: 600px)")
        if (mq.matches) {
            full = false
        }
    }
</script>

<style>
    .layout {
        display: grid;
        height: 100vh;
        width: 100vw;
        grid-template-columns: 1.5fr 6fr;
    }
    .content-wrapper {
        grid-area: 1 / 2 / 2 / 3;
        overflow-y: auto;
    }
    .content-wrapper-full {
        grid-area: 1 / 1 / 2 / 3
    }
    @media screen and (max-width: 600px) {
        .layout {
            display: grid;
            grid-template-columns: 1fr;
        }
        .content-wrapper {
            z-index: 1;
        }
        .content-wrapper-full {
            z-index: 1;
        }
    }
</style>
<div class="layout">
    <Sidebar 
        on:navitemclick={handleNavClick}
        on:navtoggled={handleNavToggled}
        author={author}
        github_url={github_url}
        linkedin_url={linkedin_url}
        twitter_url={twitter_url}
    /> 
    <div class="{ full ? 'content-wrapper-full' : 'content-wrapper' }">
        <slot></slot>
    </div>
</div>
