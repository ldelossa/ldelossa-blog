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
    deck-layout {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    card-layout {
        height: auto;
        width: 95vmin;
        display: grid;
        margin: 20px;
        overflow: auto;
        grid-template-columns: 5fr 8fr;
        grid-template-rows: 1fr;
        background: white;
	    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
    }
    project-title-wrapper {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        color: white;
    }
    section-title {
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
    project-name {
        letter-spacing: 1px;
        margin: 20px;
        font-family: 'Muli', sans-serif;
        font-size: 5vmin;
    }
    project-summary-wrapper {
        display: flex;
        flex-direction: column;
        grid-column: 2 / 3;
        grid-row: 1 / 2;
        background: white;
        color: black;
    }
    project-summary {
        opacity: 0.6;
        margin: 20px;
        font-family: 'Muli', sans-serif;
        font-size: 3vmin;
    }
</style>

<deck-layout>
    <card-layout>
        <project-title-wrapper style="background:#7ca5b8;">
            <section-title>
                <h6>Project</h6>
            </section-title>
            <project-name>
                <h2>ClairCore</h2>
            </project-name>
        </project-title-wrapper>
        <project-summary-wrapper>
            <section-title>
                <h6>Summary</h6>
                <a href="http://github.com/quay/claircore" target="_blank">
                    <img alt="github icon" src='github.svg'/>
                </a>
            </section-title>
            <project-summary>
                <p>The engine behind ClairV4</p>
            </project-summary>
        </project-summary-wrapper>
    </card-layout>
    <card-layout>
        <project-title-wrapper style="background:#db5461;">
            <section-title>
                <h6>Project</h6>
            </section-title>
            <project-name>
                <h2>Clair</h2>
            </project-name>
        </project-title-wrapper>
        <project-summary-wrapper>
            <section-title>
                <h6>Summary</h6>
                <a href="http://github.com/quay/clair" target="_blank">
                    <img alt="github icon" src='github.svg'/>
                </a>
            </section-title>
            <project-summary>
                <p>Container vulnerability scanning via static analysis</p>
            </project-summary>
        </project-summary-wrapper>
    </card-layout>
</deck-layout>
