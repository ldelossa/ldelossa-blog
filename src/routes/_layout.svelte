<script>
    import Sidebar from "../components/sidebar/Sidebar.svelte";
	import { fly, fade, slide } from 'svelte/transition';
    import {quintOut} from 'svelte/easing';

    let avatar_url = "https://avatars3.githubusercontent.com/u/5642902?s=460&u=06352b1f80c7b5e42da67189907b35cdd1586772&v=4";
    let author = "Louis DeLosSantos";
    let blurb = "Software, Hardware, Music, Linux";
    let github_url = "https://github.com/ldelossa";
    let linkedin_url = "https://www.linkedin.com/in/louisdelossantos/";
    let twitter_url = "https://twitter.com/ldelossa_ld";

    let visible = true;
    let toggleChars = {
        double: '⇔',
        left: '⇐',
        right: '⇒'
    }
    let toggle = visible ? toggleChars.left : toggleChars.right

    function toggleVisible() {
        visible = !visible;
    }

    function handleNavClick(event){
            visible = false
    }
</script>

<svelte:head>
</svelte:head>

<style>
    layout {
        display: grid;
        height: 100vh;
        width: 100vw;
        grid-template-columns: 1.5fr 8fr;
        grid-template-rows: auto;
        grid-template-areas:
            "sidebar content";
    }
    sidebar-wrapper {
        height: 100vh;
        width: auto;
        grid-area: 1 / 1 / 2 / 2;
    }
    content-wrapper {
        height: 100%;
        width: 100%;
        grid-area: 1 / 2 / 2 / 3;
    }
    .content-wrapper-full {
        height: 100%;
        width: 100%;
        grid-area: 1 / 1 / 2 / 3
    }
    .sb-toggle-button-open {
        display: inline;
        z-index: 100;
        outline: none;
        background-color: Transparent;
        border: none;
        background-color: inherit;
        padding: 10px 20px;
        font-size: 50px;
        cursor: pointer;
        color: #4b6777;
        font-family: 'Baloo Paaji 2', cursive;
        position: absolute;
        right: 0%;
    }
    .sb-toggle-button-closed {
        display: inline;
        z-index: 100;
        outline: none;
        background-color: Transparent;
        border: none;
        background-color: inherit;
        padding: 10px 20px;
        font-size: 50px;
        cursor: pointer;
        color: #4b6777;
        font-family: 'Baloo Paaji 2', cursive;
        position: absolute;
        right: 0%;
    }
    @media screen and (max-width: 600px) {
        layout {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 8fr;
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            grid-area:
                "content";
        }
        .sb-toggle-button-open {
            font-size: 30px;
        }
        .sb-toggle-button-closed {
            font-size: 30px;
        }
        sidebar-wrapper {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
            z-index: 2;
        }
        content-wrapper {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
            z-index: 1;
        }
        .content-wrapper-full {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
            z-index: 1;
        }
    }
</style>
<button 
        class:sb-toggle-button-open="{visible === true}"
        class:sb-toggle-button-closed="{visible === false}"
        on:click={toggleVisible}>
        {toggle}
</button>
<layout>
    {#if visible}
        <sidebar-wrapper transition:fly="{{ delay: 100, duration: 250, x: -200, easing: quintOut, opacity: 100 }}"
                         on:introstart="{() => visible ? toggle = toggleChars.double : toggle = toggleChars.left}"
                         on:introend="{() => visible ? toggle = toggleChars.left : toggle = toggleChars.double}"
                         on:outrostart="{() => toggle = toggleChars.double}"
                         on:outroend="{() => toggle = toggleChars.right}"
                         >
        <Sidebar 
            on:navitemclick={handleNavClick}
            avatar_url={avatar_url}
            author={author}
            blurb={blurb}
            github_url={github_url}
            linkedin_url={linkedin_url}
            twitter_url={twitter_url}
             /> 
    </sidebar-wrapper>
    {/if}
    <content-wrapper
        class:content-wrapper-full="{!visible}">
        <slot></slot>
    </content-wrapper>
</layout>
