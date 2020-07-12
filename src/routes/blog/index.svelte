<script context="module">
    export async function preload(page, session) {
        const res = await this.fetch(`blog.json`);
        const posts = await res.json();
        console.log(posts)
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
    .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-height: 100vh;
        max-width: 100vw;
    }
    .index-wrapper {
        color: #e9f1f7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        overflow: auto;
        font-family: 'Muli', sans-serif;
		padding: 45px;
        max-height: 87vh;
    }
    .entry-wrapper {
        height: auto;
        width: 75%;
        margin: 25px;
    }
    .blog_title {
        margin: 10px;
        letter-spacing: 6px;
        font-size: min(30px,4vmin);
    }
    a:hover {
        color: #f2511b;
    }
    .blog_description {
        margin: 10px;
        letter-spacing: 2px;
        font-size: min(20px, 2.5vmin);
    }
    .footer {
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
        color: white;
        font-size: min(20px, 2.5vmin);
    }
</style>

<div class="wrapper">
    <div class="index-wrapper">
        {#each posts as post} 
            <div class="entry-wrapper">
                <a class=blog_title href="/blog/{post.file}">{post.title}</a>
                <p class=blog_description>{post.date}</p>
                <p class=blog_description>{post.desc}</p>
            </div>
        {/each}
    </div>
    <div class="footer">
        <a href="http://ldelossa.goatcounter.com">stats@goatcounter</a>
    </div>
</div>
