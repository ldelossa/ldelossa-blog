const ghpages = require('gh-pages');

ghpages.publish(
    '__sapper__/export',
    {
        repo: 'git@github.com:ldelossa/ldelossa-blog.git',
        user: {
            name: 'ldelossa',
            email: 'louis.delos@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)
