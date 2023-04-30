## Update to the latest Nx version
```
https://nx.dev/core-features/automate-updating-dependencies

nx migrate latest 
nx migrate --run-migrations
delete migrations.json and commit
```

## npm не туда устанавливает пакеты и выдает ошибку?
```
Прислали решение, кому интересно:
npm get prefix
выводит:
C:\users\your_user\AppData\Roaming\npm

Соответственно помогло:
npm config set prefix="C:\Users\nka20\AppData\Roaming\npm"
```
