<script>
    import Sidebar from "../components/sidebar/Sidebar.svelte";

    let avatar_url = "https://media-exp1.licdn.com/dms/image/C5103AQES1N5l8DdVNg/profile-displayphoto-shrink_100_100/0?e=1591833600&v=beta&t=Z7oDXMDPRT6elj2WSGu9ZJ__j03CkbzC-ZB9ok75tuk";
    let author = "Louis DeLosSantos";
    let blurb = "Software, Hardware, Music, Linux";
    let github_url = "https://github.com/ldelossa";
    let linkedin_url = "https://www.linkedin.com/in/louisdelossantos/";
    let twitter_url = "https://twitter.com/ldelossa_ld";
</script>

<svelte:head>
</svelte:head>

<style>
    layout {
        display: grid;
        grid-template-columns: minmax(300px, 1fr) 4fr;
        grid-template-rows: minmax(550px, auto);

        grid-template-areas:
            "sidebar content";
    }
    .item {
        background: grey;
        color: white;
        padding: 10px;
    }
</style>

<layout>
    <Sidebar 
        avatar_url={avatar_url}
        author={author}
        blurb={blurb}
        github_url={github_url}
        linkedin_url={linkedin_url}
        twitter_url={twitter_url}
         /> 
    <div>
        <slot></slot>
    </div>
</layout>
