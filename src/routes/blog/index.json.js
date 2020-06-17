// index defines an index of blog entries and exports it
// other javascript apis 
export const index = [
  {
      id: "94297015-acc4-4089-b438-eeb566ce9c17",
      date: "2020-06-14T15:57:12+00:00",
      title: "A Minimal Home Network Pt1",
      desc: "I introduce my new minimal home network powered by containers",
      file: "home-network-pt1.md"
  },
]
export async function get(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(index));
}
