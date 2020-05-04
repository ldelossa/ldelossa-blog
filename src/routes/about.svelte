<script>

</script>

<style>
    about-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: #2c2c2c; 
        height: 100%;
        width: 100%;
    } 
    card {
      box-shadow: 0 4px 8px 0 rgba(150,150,150,0.5);
      border-radius: 10px;
      transition: 0.3s;
      height: 75%;
      width: 50%;
      margin: 50px;
      background: white;
      overflow: scroll;
    }
    card:hover {
      box-shadow: 0 8px 16px 0 rgba(255,250,250,0.7);
    }

    hideable-card {
      box-shadow: 0 4px 8px 0 rgba(150,150,150,0.5);
      border-radius: 10px;
      transition: 0.3s;
      height: 75%;
      width: 50%;
      margin: 50px;
      background: white;
      overflow: scroll;
    }
    hideable-card:hover {
      box-shadow: 0 8px 16px 0 rgba(255,250,250,0.7);
    }

    .about-title {
      font-family: 'Source Code Pro', monospace;
      color: #4b6777;
      font-size: 3.5vmin;
      text-align: center;
      padding: 50px;
    }
    .about-blurb {
      font-family: 'Source Code Pro', monospace;
      color: #4b6777;
      font-size: 2vmin;
      text-align: center;
      padding: 40px;
    }
    hr {
        border: 0;
        height: 1px;
        background: #333;
        background-image: linear-gradient(to right, #ccc, #333, #ccc);
    }
    blurb-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-content: center;
        height: 100%;
        width: 100%;
    }
    resume-wrapper {
        height: 100%;
        width: 50%;
    }
    icons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    } 
    img {
        width: min(2vmin, 30px);
        height: min(2vmin, 30px);
        color: #4b6777;
    }
    @media screen and (max-width: 600px) {
        about-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #2c2c2c; 
            height: 100%;
            width: 100%;
        } 
        card {
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          transition: 0.3s;
          height: 75%;
          width: 75%;
          margin: 10px;
          background: white;
        }
        hideable-card {
            display: none;
        }
    }
</style>

<svelte:head>
	<title>About</title>
</svelte:head>

<about-wrapper>
    <card>
        <blurb-wrapper>
            <div>
                <h1 class=about-title>About Me</h1>
                <icons>
                        <img src='c.svg'/>
                        <img src='cplusplus.svg'/>
                        <img src='gnu.svg'/>
                        <img src='go.svg'/>
                        <img src='rust.svg'/>
                        <img src='linux.svg'/>
                        <img src='redhat.svg'/>
                </icons>
            </div>
            <div>
                <p class=about-blurb>
                    I'm a software engineer living in Brooklyn NY.<br/>
                <p/>
            </div>
            <div>
                <p class=about-blurb>
                My career started as a datacenter systems/network engineer where I learned quite a lot about systems performance,
                IO, distributed systems, and hardware.<br/>
                </p>
            </div>
            <div>
                <p class=about-blurb>
                I took this experience and found a challenge in DevOps for awhile and this ultimately lead to me learning programming.<br/>
                I am selt taught in most things with various trainings here and there mostly for fun. <br/>
                </p>
            </div>
            <div>
                <p class=about-blurb>
                My current full time role is with RedHat where I lead a project called ClairCore. <br/>
                </p>
            </div>
        </blurb-wrapper>
    </card>
    <hideable-card>
        <iframe overflow=hidden height=100% width=100% src="https://docs.google.com/document/d/e/2PACX-1vTKxQE0Yg0pEoWorCtNFoSQxjvX2Jv0P588hXMhxw-Wy4jqtCa6Qk5pWCVaPJcPV3HToIvEQ8kUeYBM/pub?embedded=true"></iframe>
    </hideable-card>
</about-wrapper>

