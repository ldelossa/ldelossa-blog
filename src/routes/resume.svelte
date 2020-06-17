<script>
    import Card from "../components/card/Card.svelte";

    let resumeEmbed = `
    <iframe overflow=hidden height=100% width=100% src="https://docs.google.com/document/d/e/2PACX-1vTKxQE0Yg0pEoWorCtNFoSQxjvX2Jv0P588hXMhxw-Wy4jqtCa6Qk5pWCVaPJcPV3HToIvEQ8kUeYBM/pub?embedded=true"></iframe>
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
    @media screen and (max-width: 1048px) {
        about-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #2c2c2c; 
            height: 100%;
            width: 100%;
        } 
    }
</style>

<svelte:head>
	<title>About</title>
</svelte:head>

<about-wrapper>
    <Card class=displayed title="Resume"
          blurb={resumeEmbed}>
    </Card>
</about-wrapper>

