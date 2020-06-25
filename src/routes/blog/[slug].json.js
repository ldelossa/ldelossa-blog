import {index} from "./index.json.js";
const marked = require('marked');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const posts_dir = path.join(cwd, 'src/routes/blog/posts/')

export async function get(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	const {slug} = req.params;
	const article = index.find((post)=>{
			return post.id === slug;
	});

	const data = fs.readFileSync(path.join(posts_dir, article.file), 'utf-8')
	const html = marked(data);
	article.html = html;

	res.end(JSON.stringify(article));
}
