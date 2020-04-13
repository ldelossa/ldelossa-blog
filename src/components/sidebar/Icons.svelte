<script>
    export let github_url;
    export let linkedin_url;
    export let twitter_url;
</script>

<style>
    icons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
    } 
    img {
        width: 3vw;
        height: 3vh;
    }
</style>

<icons>
    <a href={linkedin_url} target="_blank">
        <img src='linkedin.svg'/>
    </a>
    <a href={github_url} target="_blank">
        <img src='github.svg'/>
    </a>
    <a href={twitter_url} target="_blank">
        <img src='twitter.svg'/>
    </a>
</icons>
