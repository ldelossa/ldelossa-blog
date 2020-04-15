<script>
    import Console from "./Console.svelte"
    import SidebarItem from "./SidebarItem.svelte"
    import Icons from "./Icons.svelte"
    export let avatar_url;
    export let github_url;
    export let linkedin_url;
    export let twitter_url;
    export let author;
    export let blurb;
</script>

<style>
    sidebar {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        -moz-box-shadow:    0px 0px 5px 6px #ccc;
        -webkit-box-shadow: 0px 0px 5px 6px #ccc;
        box-shadow:         0px 0px 5px 6px #ccc;
        margin-right: 1vmin;
        border-right: 4px outset black;
        background: #28536b;
    }
    avatar-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 8vmin;
    }
    .avatar {
        border-radius: 25%;
        border: 2px solid #f6f0ed;
        margin: auto;
    }
    author-wrapper {
        margin: 4vmin 1vmin 4vmin 1vmin;
    }
    .author {
        text-align: center;
        font-size: 2rem;
        color: #e9f1f7;
        font-family: 'Baloo Paaji 2', cursive;
    }
    nav {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin: 4vmin 4vmin 6vmin 4vmin;
        flex-wrap: wrap;
    }
    console-wrapper {
        margin: 1vmin 2vmin 1vmin 2vmin;
    }
    icons-wrapper {
        margin-top: 4vmin;
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
        nav {
            flex-direction: row;
        }
    }
</style>

<sidebar >
    <avatar-wrapper>
        <img class="avatar" src={avatar_url}>
    </avatar-wrapper>
    <author-wrapper>
        <p class="author">{author}<p>
    </author-wrapper>
    <console-wrapper>
        <Console/>
    </console-wrapper>
    <nav>
        <SidebarItem name="about" href="about"/>
        <SidebarItem name="projects" href="projects"/>
        <SidebarItem name="blog" href="blog"/>
    </nav>
    <icons-wrapper>
        <Icons github_url={github_url} 
               linkedin_url={linkedin_url}
               twitter_url={twitter_url}/>
    </icons-wrapper>
</sidebar>
