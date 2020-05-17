<script>
    import ProfileCard from "../components/card/ProfileCard.svelte";
    let avatar_url = "https://avatars3.githubusercontent.com/u/5642902?s=460&u=06352b1f80c7b5e42da67189907b35cdd1586772&v=4";
</script>

<style>
    about-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #2c2c2c; 
        height: 100%;
        width: 100%;
    } 
</style>

<svelte:head>
	<title>About</title>
</svelte:head>

<about-wrapper>
    <ProfileCard avatar_url={avatar_url}>
    </ProfileCard>
</about-wrapper>

