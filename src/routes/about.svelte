<script>
    import Card from "../components/card/Card.svelte";
    import ProfileCard from "../components/card/ProfileCard.svelte";
    let avatar_url = "https://avatars3.githubusercontent.com/u/5642902?s=460&u=06352b1f80c7b5e42da67189907b35cdd1586772&v=4";

    let aboutBlurb = `
    <p>
      I'm a software engineer working out of Brooklyn NY.<br/>
    <p/>
    <br/>
    <p>
        My career started as a datacenter systems/network engineer where I learned quite a lot about systems performance,
        IO, distributed systems, and hardware.<br/>
    </p>
    <br/>
    <p>
        I took this experience and found a challenge in DevOps for awhile and this ultimately lead to me learning programming.<br/>
    </p>
    <br/>
    <p>
        I am selt taught in most things with various trainings here and there mostly for fun. <br/>
    </p>
    <br/>
    <p>
        My current full time role is with RedHat where I lead a project called ClairCore. <br/>
    </p>
    `
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
    .displayed {
        display: visible;
    }
</style>

<svelte:head>
	<title>About</title>
</svelte:head>

<about-wrapper>
    <ProfileCard avatar_url={avatar_url}>
    </ProfileCard>
</about-wrapper>

