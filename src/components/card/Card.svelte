<script>

    export let title = '';
    export let blurb = '';
    let open = true;
    let closeCard = () => { open = false };
</script>

<style>
    card-layout {
      height: 75%;
      width: 75%;
      box-shadow: 0px 8px 60px -10px rgba(13,28,39,0.6);
      border-radius: 10px;
      display: grid;
      margin: 20px;
      overflow: auto;
      background: white; 
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 8fr;
      grid-template-areas:
        "header"
        "body";
    }
    card-title {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      font-family: 'Source Code Pro', monospace;
      font-size: 3.5vmin;
      color: white;
      background:  #4b6777;
      border-radius: 2px;
      padding: 20px;
    }
    card-body {
      font-family: 'Source Code Pro', monospace;
      font-size: 2.5vmin;
      padding: 30px;
    }
</style>

{#if open}
    <card-layout>
        <card-title>
            {@html title}
        </card-title>
        <card-body>
            {@html blurb}
        </card-body>
    </card-layout>
{/if}
