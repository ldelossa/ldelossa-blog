<script context="module">
    export async function preload(page, session) {
        const { slug } = page.params;
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
        color: white;
    }
	.markdown-body {
		min-width: 100px;
		max-width: 50%;
		margin: 0 auto;
		padding: 45px;
        color: #e9f1f7;
        font-family: 'Muli', sans-serif;
	}
	@media (max-width: 767px) {
		.markdown-body {
		    max-width: 75%;
		}
	}
</style>


<blog-wrapper>
    <article class="markdown-body">
        {@html article.html}
    </article>
</blog-wrapper>
