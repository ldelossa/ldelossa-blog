<script>
    import ProjectDeck from "../components/card/ProjectDeck.svelte";
</script>

<style>
    .projects-wrapper {
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
	<title>Projects</title>
</svelte:head>

<div class="projects-wrapper">
    <ProjectDeck>
    </ProjectDeck>
</div>
