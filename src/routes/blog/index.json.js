// index defines an index of blog entries and exports it
// other javascript apis 
export const index = [
  {
      date: "2020-07-03",
      title: "A Minimal Home Network Pt2",
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
      title: "A Minimal Home Network Pt1",
      desc: "I introduce my new minimal home network powered by containers",
      file: "home-network-pt1"
  },
]
export async function get(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var i = index.sort((a, b) => b.date - a.date)
		res.end(JSON.stringify(i));
}
