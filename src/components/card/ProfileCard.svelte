<script>
    import Icons from "../sidebar/Icons.svelte";

    export let avatar_url;
    let github_url = "https://github.com/ldelossa";
    let linkedin_url = "https://www.linkedin.com/in/louisdelossantos/";
    let twitter_url = "https://twitter.com/ldelossa_ld";
</script>

<style>
    card-layout {
        height: 75vmin;
        width: 80vmin;
        min-width: 300px;
        min-height: 350px;
        display: grid;
        margin: 20px;
        overflow: auto;
        grid-template-columns: 4fr 2.5fr 4fr;
        grid-template-rows: 1fr 1fr 6fr;
    }
    @media screen and (max-width: 1024px) {
        card-layout {
            height: 100vmin;
            width: auto;
        }
    }
    .avatar {
        min-height: 70px;
        min-width: 70px;
        grid-column: 2 / 3;
        grid-row: 1 / 3;
        z-index: 3;
        border-radius: 50%;
    }
    .avatar-img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        border: 2px solid #dee2d6;
    }
    .content {
        height: auto;
        width: auto;
        grid-column: 1 / 4;
        grid-row: 2 / 4;
        z-index: 1;
        background: #4b6777; 
        border-radius: 5%;
        border: 4px solid #dee2d6;
    }
    .text-area {
        text-align: center;
        align-content: center;
        height: auto;
        width: auto;
        grid-column: 1 / 4;
        grid-row: 3 / 4;
        z-index: 2;
        background: #4b6777; 
        border-radius: 5%;
        margin: 20px;
        color: #e9f1f7;
    }
    .location-wrapper{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
    }
    .author {
      font-family: 'Muli', sans-serif;
      letter-spacing: 1px;
      font-size: 3.5vmin;
      padding: 15px;
    }
    .title {
      font-family: 'Muli', sans-serif;
      letter-spacing: 1px;
      font-size: 2.5vmin;
      padding: 15px;
      color: #f2511b;
    }
    .blurb {
      font-family: 'Muli', sans-serif;
      letter-spacing: 1px;
      font-size: 2.5vmin;
      margin: 10vmin;
    }
    .icon-img {
        height: auto;
        width: 24px;
    }
</style>

<card-layout>
    <div class="avatar">
        <img alt="avatar image" class="avatar-img" src={avatar_url}>
    </div>
    <div class="content">
    </div>
    <div class="text-area">
        <p class=author>Louis DeLosSantos</p>
        <p class=title>Principal Software Engineer</p>
        <div class="location-wrapper">
            <img alt="location icon" class="icon-img" src='googlemaps.svg'/>
            <p class=author>Brooklyn NY</p>
        </div>
        <p class=blurb>
            I'm a technologist who writes a lot of Go code,
            makes music occasionally, and works at Red Hat.
        </p>
        <Icons github_url={github_url} 
               linkedin_url={linkedin_url}
               twitter_url={twitter_url}/>
    </div>
</card-layout>
