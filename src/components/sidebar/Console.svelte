<script>
    import { onMount } from 'svelte';
    onMount(() => {
        var cursor = true;
        var speed = 300;

        setInterval(() => {
           if(cursor) {
             document.getElementById('cursor').style.opacity = 0;
             cursor = false;
           }else {
             document.getElementById('cursor').style.opacity = 1;
             cursor = true;
           }
        }, speed);
    });
</script>


<style>
    pre code {
        border-radius: 3%;
        padding: 10px;
        display: block;
        min-width: 230px;
        max-width: 275px;
        background: #333;
        color: #737373;
    }
</style>

<pre>
    <code>
❯ tree ./ldelossa 
├── hardware
├── linux
├── music
└── software
❯ <span id="cursor">▊</span>
    </code>
</pre>
