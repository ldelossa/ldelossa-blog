<script>
</script>

<style>
    img {
        width: 40px;
        height: 40px;
    }
    img:hover {
        -webkit-filter: drop-shadow(2px 2px 2px #222);
        filter: drop-shadow(2px 2px 2px #222);
    }
    .deck-layout {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .card-layout {
        display: flex;
        flex-direction: row;
        height: auto;
        width: 95vmin;
        max-width: 1000px;
        min-width: 300px;
        margin: 20px;
        overflow: auto;
        background: white;
	    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
    }
    .project-title-wrapper {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        color: white;
        width: 40%;
    }
    .section-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 20px; 
        opacity: 0.6;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-family: 'Muli', sans-serif;
        font-size: 3vmin;
    }
    .project-name {
        letter-spacing: 1px;
        margin: 20px;
        font-family: 'Muli', sans-serif;
        font-size: 5vmin;
    }
    .project-summary-wrapper {
        display: flex;
        flex-direction: column;
        background: #181a1b;
        color: white;
        width: 60%;
    }
    .project-summary {
        opacity: 0.6;
        margin: 20px;
        font-family: 'Muli', sans-serif;
        font-size: 3vmin;
    }
</style>

<div class="deck-layout">
    <div class="card-layout">
        <div class="project-title-wrapper" style="background:#7ca5b8;">
            <div class="section-title">
                <h6>Project</h6>
            </div>
            <div class="project-name">
                <h2>ClairCore</h2>
            </div>
        </div>
        <div class="project-summary-wrapper">
            <div class="section-title">
                <h6>Summary</h6>
                <a href="http://github.com/quay/claircore" target="_blank">
                    <img alt="github icon" src='github.svg'/>
                </a>
            </div>
            <div class="project-summary">
                <p>The engine behind ClairV4</p>
            </div>
        </div>
    </div>
    <div class="card-layout">
        <div class="project-title-wrapper" style="background:#db5461;">
            <div class="section-title">
                <h6>Project</h6>
            </div>
            <div class="project-name">
                <h2>Clair</h2>
            </div>
        </div>
        <div class="project-summary-wrapper">
            <div class="section-title">
                <h6>Summary</h6>
                <a href="http://github.com/quay/clair" target="_blank">
                    <img alt="github icon" src='github.svg'/>
                </a>
            </div>
            <div class="project-summary">
                <p>Container vulnerability scanning via static analysis</p>
            </div>
        </div>
    </div>
</div>
