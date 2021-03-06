// index defines an index of blog entries and exports it
// other javascript apis 
export const index = [
  {
      date: "2020-10-5",
      title: "Flashing QMK Firmware With The Help Of Docker",
      desc: "We explore a way to self-contain QMK dependencies use for flashing popular DIY keyboards.",
      file: "qmk-docker"
  },
  {
      date: "2020-9-22",
      title: "The Absolute Minimum Every Software Developer Must Know About Cryptography",
      desc: "What every developer should know about crytography to make their lifes easier.",
      file: "absolute-minimum-cryptography"
  },
  {
      date: "2020-9-15",
      title: "Optimizing PGX Allocations in Golang with Pprof.",
      desc: "An example utilizing pprof for some impressive allocation reductions in the PGX sql library.",
      file: "allocation_optimization_in_go"
  },
  {
      date: "2020-08-06",
      title: "Git Worktree Flow",
      desc: "A workflow for keeping clean commit histories",
      file: "git-worktree-flow"
  },
  {
      date: "2020-07-16",
      title: "Sequential Consistency In Practice",
      desc: "Clarification on sequential consistency and distributed system",
      file: "sequential-consistency-in-practice"
  },
  {
      date: "2020-07-11",
      title: "The Good With The Bad: Go's net/url.URL and JSON",
      desc: "Why seemingly inconvenient approaches lead to value in the long run.",
      file: "go-url-encoding"
  },
  {
      date: "2020-07-03",
      title: "Building A Home Lab With Podman - Pt2",
      desc: "Application routing is introduced into the home lab",
      file: "home-network-pt2"
  },
  {
      date: "2020-06-25",
      title: "LFD-420 Review",
      desc: "My review of the Linux Foundation's course Linux Kernel Internals and Development (LFD420)",
      file: "lfd420-review"
  },
  {
      date: "2020-06-14",
      title: "Building A Home Lab With Podman - Pt1",
      desc: "Learn how Podman can be used to create a home lab newtork and name resolution.",
      file: "home-network-pt1"
  },
]
export async function get(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var i = index.sort((a, b) => b.date - a.date)
		res.end(JSON.stringify(i));
}
