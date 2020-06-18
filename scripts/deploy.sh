#!/bin/sh

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
HEAD="$(git symbolic-ref HEAD)"
git symbolic-ref HEAD refs/heads/gh-pages
git reset "$HEAD"
git rm --cached -rf .
npx sapper export || exit 1
cd __sapper__/export/
echo "www.ldelossa.is" > CNAME
files=($(find -type f | cut -c 3-))
for file in ${files[@]}; do hash=$(git hash-object -w $file); git update-index --add --cacheinfo 100644,$hash,$file; done
git commit -m 'Build'
git symbolic-ref HEAD "$HEAD"
git reset "$ROOT"
git push -f origin gh-pages
