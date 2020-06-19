<script>
    import Console from "./Console.svelte";
    import SidebarItem from "./SidebarItem.svelte";
    import Icons from "./Icons.svelte";
    import { createEventDispatcher } from 'svelte';

    export let github_url;
    export let linkedin_url;
    export let twitter_url;
    export let author;

    let visible = false;
    let toggle = '☰';

    /* when the toggle is clicked we'll dispatch
       an event for others to listen */
    const dispatch = createEventDispatcher()
    function toggleVisible() {
        visible = !visible;
        dispatch('navtoggled', {
            visible: visible
        });
    }

    /* if media query is true clicking on icons will
       hide the sidebar automatically */
    function handleNavClick(event){
        const mq = window.matchMedia("(max-width: 600px)")
        if (mq.matches) {
            visible = false
        }
    }
</script>

<style>
    .sidebar-open {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;
        width: 100%;
        margin-right: 1vmin;
        background: #4b6777; 
    }
    .sidebar-closed {
        display: none;
    }
    .sb-toggle-button-open {
        display: fixed;
        z-index: 100;
        outline: none;
        background-color: Transparent;
        border: none;
        padding: 10px 12px;
        font-size: 30px;
        cursor: pointer;
        color: #f3f8f2;
        font-family: 'Muli', cursive;
        position: absolute;
        left: 0%;
    }
    .sb-toggle-button-closed {
        display: inline;
        z-index: 100;
        outline: none;
        background-color: Transparent;
        border: none;
        padding: 10px 12px;
        font-size: 30px;
        cursor: pointer;
        color: #4b6777;
        font-family: 'Muli', cursive;
        position: absolute;
        left: 0%;
    }
    author-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 40px;
    }
    .author {
        text-align: center;
        font-size: 2rem;
        color: white;
        font-family: 'Muli', sans-serif;
        letter-spacing: 1px;
    }
    console-wrapper {
        margin: 20px;
    }
    nav {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    icons-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
    }
    /* hide everthing except for nav */
    @media screen and (max-width: 600px) {
        .sidebar-open {
            /* resets */
            -moz-box-shadow:    initial;
            -webkit-box-shadow: initial;
            box-shadow:         initial;
            margin-right: initial;
            border-right: initial;
        }
        icons-wrapper {
            display: flex;
            grid-area: icons;
            flex-direction: column;
            justify-content: space-between;
        }
    }
</style>

<button 
        class:sb-toggle-button-open="{visible === true}"
        class:sb-toggle-button-closed="{visible === false}"
        on:click={toggleVisible}>
        {toggle}
</button>
<div class="{ visible ? 'sidebar-open' : 'sidebar-closed' }">
    <author-wrapper>
        <p class="author">{author}<p>
        <console-wrapper>
            <Console/>
        </console-wrapper>
    </author-wrapper>
    <nav>
        <SidebarItem on:navitemclick={handleNavClick} name="about" href="about"/>
        <SidebarItem on:navitemclick={handleNavClick} name="resume" href="resume"/>
        <SidebarItem on:navitemclick={handleNavClick} name="projects" href="projects"/>
        <SidebarItem on:navitemclick={handleNavClick} name="blog" href="blog"/>
    </nav>
    <icons-wrapper>
        <Icons github_url={github_url} 
               linkedin_url={linkedin_url}
               twitter_url={twitter_url}/>
    </icons-wrapper>
</div>
