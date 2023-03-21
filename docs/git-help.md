## VS code git
[vscode&github](https://vscode.github.com)
## Git help about-remote-repositories
[doc git](https://docs.github.com/ru/get-started/getting-started-with-git/about-remote-repositories)


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
  
  ```