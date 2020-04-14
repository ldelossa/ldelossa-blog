<script>
    import Sidebar from "../components/sidebar/Sidebar.svelte";
	import { fly } from 'svelte/transition';

    let avatar_url = "https://media-exp1.licdn.com/dms/image/C5103AQES1N5l8DdVNg/profile-displayphoto-shrink_100_100/0?e=1591833600&v=beta&t=Z7oDXMDPRT6elj2WSGu9ZJ__j03CkbzC-ZB9ok75tuk";
    let author = "Louis DeLosSantos";
    let blurb = "Software, Hardware, Music, Linux";
    let github_url = "https://github.com/ldelossa";
    let linkedin_url = "https://www.linkedin.com/in/louisdelossantos/";
    let twitter_url = "https://twitter.com/ldelossa_ld";

    let visible = true;
    function toggleVisible() {
        visible = !visible;
    }
</script>

<svelte:head>
</svelte:head>

<style>
    layout {
        display: grid;
        height: 100vh;
        width: 100vw;
        grid-template-columns: 1fr 8fr;
        grid-template-rows: auto;
        grid-template-areas:
            "sidebar content";
    }
    sidebar-wrapper {
        height: 100%;
        width: 100%;
    }
    #sb-toggle-button {
        display: none;
        position: absolute;
        right: 0%;
    }
    content-wrapper {
        height: 100%;
        width: 100%;
    }
    @media screen and (max-width: 600px) {
        layout {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            grid-area:
                "content";
        }
        #sb-toggle-button {
            display: inline;
            z-index: 100;
        }
        /* make these overlap */
        sidebar-wrapper {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            z-index: 2;
        }
        content-wrapper {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            z-index: 1;
        }
    }
</style>

<button id="sb-toggle-button" on:click={toggleVisible}>
    sidebar
</button>
<layout>
    {#if visible}
    <sidebar-wrapper transition:fly="{{ x: -200, duration: 200 }}">
        <Sidebar 
            avatar_url={avatar_url}
            author={author}
            blurb={blurb}
            github_url={github_url}
            linkedin_url={linkedin_url}
            twitter_url={twitter_url}
             /> 
    </sidebar-wrapper>
    {/if}
    <content-wrapper>
        <slot></slot>
    </content-wrapper>
</layout>
