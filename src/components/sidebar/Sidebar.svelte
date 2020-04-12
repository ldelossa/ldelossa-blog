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
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background: #28536b;
        min-height: 700px;
        height: 100vh;
        width: auto;
        -moz-box-shadow:    0px 0px 5px 6px #ccc;
        -webkit-box-shadow: 0px 0px 5px 6px #ccc;
        box-shadow:         0px 0px 5px 6px #ccc;
        margin-right: 1em;
        border-right: 3px outset black;
    }
    avatar-wrapper {
        margin-top: 5em;
    }
    .avatar {
        border-radius: 25%;
        border: 2px solid #f6f0ed;
        margin: 0 auto;
    }
    author-wrapper {
        margin: 2rem 1rem 1rem 1rem;
    }
    .author {
        text-align: center;
        font-size: xx-large;
        color: #e9f1f7;
        font-family: 'Baloo Paaji 2', cursive;
    }
    blurb-wrapper {
        margin: 2rem 1rem 2rem 1rem;
    }
    .blurb {
        text-align: center;
        color: #c2948a;
        font-size: large;
        font-family: 'Baloo Paaji 2', cursive;
    }
    nav {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin: 4vmin 4vmin 6vmin 4vmin;
        flex-wrap: wrap;
    }
    icons-wrapper {
        margin-top: 3vmin;
    }
    @media screen and (max-height: 750px) {
        icons-wrapper{
            margin: 0;
        }
        nav {
            flex-direction: row;
        }
    }
    pre code {
        border-radius: 3%;
        padding: 5px;
        margin: 0 2rem 0 2rem;
        display: block;
    }
</style>

<sidebar>
    <avatar-wrapper>
        <img class="avatar" src={avatar_url}>
    </avatar-wrapper>
    <author-wrapper>
        <p class="author">{author}<p>
    </author-wrapper>
    <Console/>
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
