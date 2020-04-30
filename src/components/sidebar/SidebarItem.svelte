<script>
    export let name
    export let href
</script>

<style>
    button-wrapper {
        text-align: center;
        margin: 1rem 0 1rem 0;
        padding: 1rem 1rem 1rem 1rem;
    }
    .button-ref {
        text-decoration: underline;
        font-size: 30px;
        color: #e9f1f7;
        font-family: 'Baloo Paaji 2', cursive;
    }
</style>

<button-wrapper>
    <a class="button-ref" href={href}>{name}</a>
</button-wrapper>
