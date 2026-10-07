import git

repo = git.Repo('/path/to/your/repo')
repo.git.checkout('develop')
repo.git.pull('origin', 'develop')   