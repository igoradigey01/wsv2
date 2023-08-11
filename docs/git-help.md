## VS code git
[vscode&github](https://vscode.github.com)
## Git help about-remote-repositories
[doc git](https://docs.github.com/ru/get-started/getting-started-with-git/about-remote-repositories)
## create
 1. create in github
 2. init in project
- git init
- git add README.md
- git commit -m "first commit"
- git branch -M main
- git remote add origin https://github.com/igoradigey01/webapi.git
- git push -u origin main

 ## Commit names
 ```
 Type: chore, docs, feat, fix, refactor, style, or test.

 chore: add Oyster build script
docs: explain hat wobble
feat: add beta sequence
fix: remove broken confirmation message
refactor: share logic between 4d3d3d3 and flarhgunnstow
style: convert tabs to spaces
test: ensure Tayne retains clothing
 ```


## Git шпоргалка
  ```
  git init [project-name] — создать новый локальный репозиторий с заданным именем.
  git clone [url] — загрузить проект и его полную историю изменений.
  git branch -m <new name of branch> -переименовать текущюю ветку(main)
  git push origin <name of branch> -при несуществующей ветки git создаст ее автоматически.
  ### 
  git add . — сделать все измененные файлы готовыми для коммита.
  git commit -m "[descriptive message]" — записать изменения с заданным сообщением.
  git commit --amend — добавить изменения к последнему коммиту.
  ###
  git branch — список всех локальных веток в текущей директории.
  git branch [branch-name] — создать новую ветку.
  git checkout [branch-name] — переключиться на указанную ветку и обновить рабочую директорию.
  git checkout -b <name>  — переключиться на созданную ветку.
  ###
  git merge [branch] — соединить изменения в текущей ветке с изменениями из заданной.
  git fetch   — загрузить с заданного удаленного репозитория.
  git push — запушить текущую ветку в удаленную ветку.

  https://github.com/igoradigey01/wsv2
  
  ```