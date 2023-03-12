## Deploy
```
ssh root@46.173.223.214
//deploy
scp -r C:\Users\Ks34\Documents\AngularProject\xf01\dist\xf01 root@46.173.223.214:~/myapp/nginx/data
// backup
scp -r root@46.173.223.214:~/myapp/images  E:\Backup_Host\Backup_images\12-05-22
//---- docker-отчет об использовании дискового пространства
docker system df
docker volume ls
docker volume prune
```
## Serts
```
certbot certonly  --webroot    -m admin@x-01.ru -d s.x-01.ru
certbot certonly  --webroot    -m admin@x-01.ru -d xf-01.ru
//--------------------------------------
Input the webroot for s.x-01.ru: (Enter 'c' to cancel): nginx/data
```
