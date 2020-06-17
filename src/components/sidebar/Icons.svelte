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
        width: 30px;
        height: 30px;
    }
</style>

<icons>
    <a href={linkedin_url} target="_blank">
        <img alt="linkedin icon" src='linkedin.svg'/>
    </a>
    <a href={github_url} target="_blank">
        <img alt="github icon" src='github.svg'/>
    </a>
    <a href={twitter_url} target="_blank">
        <img alt="twitter icon" src='twitter.svg'/>
    </a>
</icons>
