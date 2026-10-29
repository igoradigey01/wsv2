git switch -c developer
git branch
git add --dry-run . | head -50
git add .
git status
git commit -m "Initial commit: legacy WinForms .NET 2.0 project"
git log --oneline
git branch
# 1. Переключиться на main
git switch main
# 2. Влить developer
git merge developer
# 3. Переключиться на developer
git switch developer