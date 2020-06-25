<script>
    import ProfileCard from "../components/card/ProfileCard.svelte";
    let avatar_url = "headshot.jpg";
</script>

<style>
    .about-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #e9f1f7;
        height: 100%;
        width: 100%;
    } 
</style>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="about-wrapper">
    <ProfileCard avatar_url={avatar_url}>
    </ProfileCard>
</div>

