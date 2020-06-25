<script context="module">
    export async function preload(page, session) {
        const res = await this.fetch(`blog.json`);
        const posts = await res.json();
        return { posts };
    }
</script>

<script>
    export let posts;
</script>

<svelte:head>
    <title>blog</title>
</svelte:head>

<style>
    index-wrapper {
        color: #e9f1f7;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: auto;
        font-family: 'Muli', sans-serif;
		padding: 45px;
    }
    entry-wrapper {
        height: auto;
        width: auto;
        margin: 25px;
    }
    .blog_title {
        margin: 10px;
        letter-spacing: 8px;
        font-size: min(30px,4vmin);
    }
    .blog_description {
        margin: 10px;
        letter-spacing: 2px;
        font-size: min(20px, 2.5vmin);
    }
</style>

<index-wrapper>
    {#each posts as post} 
        <entry-wrapper>
            <a class=blog_title href="{post.id}">{post.title}</a>
            <p class=blog_description>{post.date}</p>
            <p class=blog_description>{post.desc}</p>
        </entry-wrapper>
    {/each}
</index-wrapper>
