# Git Worktree Flow

What does death and Git have in common?

Just like death, Git is a fact of life for engineers writing code in 2021.

Just like death, some people fear Git while others come to terms with it.

It's safe to say there is no avoiding Git, like there is no avoiding death, may as well make it work for us.

In this post I will share a new workflow utilizing Git's worktree feature that has been working well for me.

# The Scenario

A repository exists, a topic branch is checked out, and it is complete.

```
❯ git log
commit 2d27894d5f6876ae456470f59a21bbd77184a853 (HEAD -> topic-branch)
Author: louis <louis@localhost.localdomain>
Date:   Thu Aug 6 16:02:10 2020 -0400

    implement plumbing

commit 1cecb9d66c84cc007479330eec08ce74ae583cd2
Author: louis <louis@localhost.localdomain>
Date:   Thu Aug 6 16:01:36 2020 -0400

    implement business logic

commit abff991f6549435d2d8140182fc37603cff1a2c4
Author: louis <louis@localhost.localdomain>
Date:   Thu Aug 6 16:01:12 2020 -0400

    implement storage
```

The commit structure is clean, organized, and communicates a clean trajectory of deployment.

# Time For Review

A pull-request is opened against the mainline branch and a code review takes place.

The requested changes are scattered across the clean commit history.

A typical approach would involve making all the changes in a new commit with a comment such as "code review changes".

This approach is reasonable but wouldn't it be nice to keep the well organized commit history designed from the beginning?

# Worktree To The Rescue

A Git worktree allows the same repository to exist in multiple file system directories at once.

The worktree repository can have any branch checked out including a new one.

To handle the code review changes but keep our commit structure the same a worktree can be created.

```
~/git/scrap/myrepo topic-branch
❯ git worktree add ../myrepo-pr-changes
Preparing worktree (new branch 'myrepo-pr-changes')
HEAD is now at 2d27894 implement plumbing

~/git/scrap/myrepo topic-branch
❯ cd ../myrepo-pr-changes
```

The command displayed above creates the worktree directory "myrepo-pr-changes" one directory above our current, creates the branch "myrepo-pr-changes", and check this branch out in the worktree.

The branch "myrepo-pr-changes" will be a staging area where the changes required to pass the code review can be implemented.

This branch allows for all the niceties of a normal topic branch, you may author commits, reset any changes which you decide are not valuable, push this branch to save your work, etc...

# Checking Out From Worktree

At this stage the worktree branch "myrepo-pr-changes" has all the commits necessary to comfort your code reviewers.

It is time to get these changes back into the topic branch.

We can diff the code between "topic-branch" and "myrepo-pr-change" worktree branch.

```
❯ git diff --name-only topic-branch myrepo-pr-changes
businesslogic.go
plumbing.go
store.go
```

The diff shows that specific files have changed in order to appease our code reviewers.

An interactive rebase can get these changes into the correct commits by returning to the original repository directory.

```
~/git/scrap/myrepo topic-branch 36s
❯ cd ../myrepo        

~/git/scrap/myrepo topic-branch
❯ git rebase -i HEAD~2

```

Next the interactive prompt is displayed

By specifying "edit" in one of our commits the changes present in the diff between "topic-branch" and "myrepo-pr-changes" can be checked out.

```
❯ git rebase -i HEAD~2
Stopped at 1cecb9d...  implement business logic
You can amend the commit now, with

  git commit --amend

Once you are satisfied with your changes, run

  git rebase --continue

~/git/scrap/myrepo topic-branch|rebase-i* ≡
❯ git checkout myrepo-pr-changes -- businesslogic.go

~/git/scrap/myrepo topic-branch|rebase-i* ≡
❯ git status
interactive rebase in progress; onto abff991
Last command done (1 command done):
   edit 1cecb9d implement business logic
Next command to do (1 remaining command):
   pick 2d27894 implement plumbing
  (use "git rebase --edit-todo" to view and edit)
You are currently editing a commit while rebasing branch 'topic-branch' on 'abff991'.
  (use "git commit --amend" to amend the current commit)
  (use "git rebase --continue" once you are satisfied with your changes)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
    modified:   businesslogic.go

~/git/scrap/myrepo topic-branch|rebase-i* ≡
❮ git commit --amend

~/git/scrap/myrepo topic-branch|rebase-i* ≡
❯ git rebase --continue
Successfully rebased and updated refs/heads/topic-branch.
```

In the above Git sequence the interactive rebase has paused on the "implement business logic" after choosing "edit".

The file "businesslogic.go" from our "myrepo-pr-changes" branch is checked out immediately adding it to our staged commits.

An amendment is made to "implement business logic" commit, incorporating the changes in "businesslogic.go".

The rebase is told to continue and subsequently finishes.

# Conclusion

Being a bit of an eccentric about commit history, a well defined workflow for keeping things neat is attractive to me.

The use of worktrees, cross branch checkouts, and interactive rebases creates one that has worked well so far.

I hope this post gets the gears turning for your own workflows.

