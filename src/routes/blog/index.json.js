// index defines an index of blog entries and exports it
// other javascript apis 
export const index = [
  {
      id: "e288d930-1445-43b1-a076-1e3ca455034b",
      date: "2020-06-25 20:52:11-04:00",
      title: "LFD-420 Review",
      desc: "My review of the Linux Foundation's course Linux Kernel Internals and Development (LFD420)",
      file: "_lfd420-review.md"
  },
  {
      id: "94297015-acc4-4089-b438-eeb566ce9c17",
      date: "2020-06-14 15:57:12+00:00",
      title: "A Minimal Home Network Pt1",
      desc: "I introduce my new minimal home network powered by containers",
      file: "_home-network-pt1.md"
  },
]
export async function get(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var i = index.sort((a, b) => b.date - a.date)
		res.end(JSON.stringify(i));
}
