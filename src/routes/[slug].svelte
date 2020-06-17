<script context="module">
    export async function preload(page, session) {
        const { slug } = page.params;
        console.log(slug)
        const res = await this.fetch(`${slug}.json`)
        const article = await res.json();
        return {article}
    }
</script>
<script>
    export let article;
</script>

<svelte:head>
    <title>{article.title}</title>
</svelte:head>

<style>
    blog-wrapper {
        height: auto;
        width: 95%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        color: white;
    }
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
        color: #e9f1f7;
        font-family: 'Muli', sans-serif;
	}
	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>


<blog-wrapper class="container">
    <article class="markdown-body">
        {@html article.html}
    </article>
</blog-wrapper>
