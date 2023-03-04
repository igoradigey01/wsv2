##  добавить app or lib
```
 --monorepo уже создано--
 установить расшиерие 'Nx Console'
 выбрать рабрать dir
 добавить app or lib выбрав меню 'generate' в 'Nx console'
 ```
 ## Add License to repo
 [gitHub](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)

 ### Version  package

  ng version </br>
  node -v </br>
  npx  -v </br>
  [обновить node.js download](https://nodejs.org/en/download/)
 

 ## добавить 
 ### angular-material ,  angular-animations and  angular-cdk
 yarn add @angular/material @angular/cdk @angular/animations
 ### External Provider для lib account
   yarn add  i @abacritt/angularx-social-login   
   [help and sample](https://code-maze.com/how-to-sign-in-with-google-angular-aspnet-webapi/)

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