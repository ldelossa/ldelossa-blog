import {index} from "./index.json.js";
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js')
const md = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const posts_dir = path.join(cwd, 'src/routes/blog/_posts/')

export async function get(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	const {slug} = req.params;
	const article = index.find((post)=>{
			return post.file === slug;
	});

  const filename = `${article.file}.md`
	const data = fs.readFileSync(path.join(posts_dir, filename), 'utf-8')
	const html = md.render(data);
	article.html = html;

	res.end(JSON.stringify(article));
}
