<script>

</script>

<style>
    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: 5%;
        width: 100%;
    }
    left-nav {
        height: 100%;
        width: 100%;
        background: #a2aebb;
        border-bottom: 10px;
        border-right: 10px;
    }
    right-nav {
        height: 100%;
        width: 100%;
        background: #f6efed;
        border-bottom: 10px;
        border-left: 10px;
    }
    about-wrapper {
        display: grid;
        background: #a2aebb;
        height: 95%;
        width: 100%;
    } 

</style>

<svelte:head>
	<title>About</title>
</svelte:head>

<nav>
    <left-nav>
        about
    </left-nav>
    <right-nav>
        resume
    </right-nav>
</nav>
<about-wrapper>
</about-wrapper>

