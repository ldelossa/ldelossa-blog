<script>
    import Console from "./Console.svelte";
    import SidebarItem from "./SidebarItem.svelte";
    import Icons from "./Icons.svelte";
    export let github_url;
    export let linkedin_url;
    export let twitter_url;
    export let author;
</script>

<style>
    sidebar {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;
        width: 100%;
        margin-right: 1vmin;
        background: #4b6777; 
    }
    author-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        grid-area: author;
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
        grid-area: navigation;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    icons-wrapper {
        display: flex;
        grid-area: icons;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
    }
    /* hide everthing except for nav */
    @media screen and (max-width: 600px) {
        sidebar {
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



<sidebar >
    <author-wrapper>
        <p class="author">{author}<p>
        <console-wrapper>
            <Console/>
        </console-wrapper>
    </author-wrapper>
    <nav>
        <SidebarItem on:navitemclick name="about" href="about"/>
        <SidebarItem on:navitemclick name="resume" href="resume"/>
        <SidebarItem on:navitemclick name="projects" href="projects"/>
        <SidebarItem on:navitemclick name="blog" href="blog"/>
    </nav>
    <icons-wrapper>
        <Icons github_url={github_url} 
               linkedin_url={linkedin_url}
               twitter_url={twitter_url}/>
    </icons-wrapper>
</sidebar>
