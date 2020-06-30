<script>
    import Icons from "../sidebar/Icons.svelte";

    export let avatar_url;
    let github_url = "https://github.com/ldelossa";
    let linkedin_url = "https://www.linkedin.com/in/louisdelossantos/";
    let twitter_url = "https://twitter.com/ldelossa_ld";
</script>

<style>
    card-layout {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        margin: 10px;
        max-width: 630px;
    }
    @media screen and (max-width: 1024px) {
        card-layout {
            height: 100vmin;
            width: auto;
        }
    }
    .avatar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        border-radius: 50%;
    }
    .avatar-img {
        max-height: 15vh;
        max-width: 15vw;
        border-radius: 50%;
        border: 2px solid #dee2d6;
        position: relative;
        top: 38px;
        min-height: 70px;
        min-width: 70px;
    }
    .content {
        background: #4b6777; 
        border-radius: 5%;
        border: 4px solid #dee2d6;
        padding: 10px;
    }
    .text-area {
        text-align: center;
        align-content: center;
        height: auto;
        width: auto;
        background: #4b6777; 
        border-radius: 5%;
        margin: 20px;
        color: #e9f1f7;
        text-shadow: 1px 1px 0 rgba(0,0,0,0.35),1px 1px 5px rgba(0,0,0,0.5)
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
      text-shadow: -1px -1px 0 rgba(242, 81, 27, .5), -1px -1px -5px rgba(242, 81, 27, .5)
    }
    .blurb {
      font-family: 'Muli', sans-serif;
      letter-spacing: 1px;
      font-size: 2.5vmin;
      margin: 5vmin;
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
        <div class="text-area">
            <p class=author>Louis DeLosSantos</p>
            <p class=title>Principal Software Engineer</p>
            <div class="location-wrapper">
                <img alt="location icon" class="icon-img" src='googlemaps.svg'/>
                <p class=author>Brooklyn, NY</p>
            </div>
            <p class=blurb>
                A wanna-be kernel hacker working mostly with distributed systems in Go. <br>
                <br>
                My interests stretch across infrastructure, systems programming,
                networking, and application architectures.<br>
                <br>
                I've worked at a lot of places, built a lot of things, and enjoy sharing my experience along the way.<br>
            </p>
        </div>
        <Icons github_url={github_url} 
               linkedin_url={linkedin_url}
               twitter_url={twitter_url}/>
    </div>
</card-layout>
