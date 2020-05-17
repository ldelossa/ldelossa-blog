<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
    function dispatchClick() {
        dispatch('navitemclick', {
            'text': 'nav item clicked'
        })
    }

    export let name;
    export let href;
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
        font-family: 'Muli', sans-serif;
        letter-spacing: 1px;
    }
</style>

<button-wrapper on:click={dispatchClick}>
    <a class="button-ref" href={href}>{name}</a>
</button-wrapper>
