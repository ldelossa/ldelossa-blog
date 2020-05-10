<script>
    import Console from "./Console.svelte";
    import SidebarItem from "./SidebarItem.svelte";
    import Icons from "./Icons.svelte";
    export let avatar_url;
    export let github_url;
    export let linkedin_url;
    export let twitter_url;
    export let author;
    export let blurb;
</script>

<style>
    sidebar {
        display: grid;
        height: 100%;
        width: 100%;
        grid-template-columns: 100fr;
        grid-template-rows: 4fr 3fr 11fr 2fr;
        grid-template-areas:
            "avatar"
            "author"
            "navigation"
            "icons";
        margin-right: 1vmin;
        background: #4b6777; 
    }
    avatar-wrapper {
        display: flex;
        grid-area: avatar;
        background: #f7c331; 
    }
    .avatar {
        height: 85px;
        width: 85px;
        border-radius: 35%;
        border: 5px solid white;
        margin: auto;
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
        font-family: 'Baloo Paaji 2', cursive;
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
    hr {
        border: 0;
        height: 1px;
        background: #333;
        background-image: linear-gradient(to right, #ccc, #333, #ccc);
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
            grid-template-rows: 2fr 2fr 1fr 1fr;
        }
        nav {
            flex-direction: row;
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
    <avatar-wrapper>
        <img class="avatar" src={avatar_url}>
    </avatar-wrapper>
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
