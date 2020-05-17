<script>

    export let title = '';
    export let blurb = '';
    export let project_name = '';
    export let styles;
</script>

<style>
    card-layout {
        height: 25vmin;
        width: 75vmin;
        display: grid;
        margin: 20px;
        overflow: auto;
        grid-template-columns: 5fr 8fr;
        grid-template-rows: 1fr;
        background: white;
        border-radius: 2%;
    }
    card-title-wrapper {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        background: #4b6777;
    }
    .card-title {
        color: #fff;
        padding: 30px;
        max-width: 250px;
    }
</style>

<card-layout>
    <card-title-wrapper>
        <h6 class=card-title>Project</h6>
        <h2 class=card-title>{project_name}</h2>
    </card-title-wrapper>
</card-layout>
