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
    .button-wrapper {
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
        text-shadow: 2px 2px 0 rgba(0,0,0,0.35),2px 2px 5px rgba(0,0,0,0.5);

    }
    .button-ref:hover {
        color: #f2511b;
        text-shadow: -1px -1px 0 rgba(242, 81, 27, .5), -1px -1px -5px rgba(242, 81, 27, .5)
    }
</style>

<div class="button-wrapper" on:click={dispatchClick}>
    <a class="button-ref" href={href}>{name}</a>
</div>
