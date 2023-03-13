## Docker reload app on host

```
// deploy on dockerHub
docker image push igoradigey01/shopapi_web:latest 
 
//---- docker-отчет об использовании дискового пространства
docker system df
docker volume ls
docker volume prune // delete volume
docker ps
```

## Install docker on Host vps (виртуальный сервер у провайдера)

```
//-------------- docker---------------
// обновить и установить доп пакеты
sudo apt-get update
sudo apt-get install \
 apt-transport-https \
 ca-certificates \
 curl \
 gnupg \
 lsb-release
// установить ключ
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
//------------------- проверить что установился ---
sudo apt-key list
//---------------- справка с сайта не docker --- c sample
https://world-hello.ru/docker/docker-about/kak-ustanovit-docker-v-linux-ubuntu-20-04.html

///----------------
echo \
 "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
 $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

// проверяем --(focal)--
lsb_release -cs
//---------------
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
//-----------------
docker --version
sudo systemctl status docker
// exit ( как в vim :q)
sudo docker run hello-world
```



## docker-compose.yarn on vps
,,,
version: "3.7"

services:

  nginx:
    image: nginx
    restart: always
    depends_on:
      - web
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
      - ./nginx/data/xf01:/var/www/xf01/html
      - ./nginx/data/xl01:/var/www/xl01/html
      - ./nginx/data/x01:/var/www/x01/html
      - ./nginx/data:/usr/share/nginx/html
    ports: 
       - "443:443"
       - "80:80"

  web:
    image: igoradigey01/shopapi_web:latest
    restart: always
    depends_on:
        - db
    environment:
       ASPNETCORE_ENVIRONMENT: Production
       ASPNETCORE_URLS: http://+:80
       FrontClient1: https://x-01.ru
       FrontClient2: https://xf-01.ru
       Issuer: https://s.x-01.ru
       Audience: https://x-01.ru
       ClientSecrets: client_secret_swagger
       Scopes: api1.read
       AdminPass: ####
       AdminEmail: ###@x-01.ru
       AdminPhone: +79002440328
       ConnectString: server=db;port=3306;UserId=root;Password=####
       From: ###@x-01.ru
       SmtpServer: smtp.mail.ru
       Port: 465
       Username: ###@x-01.ru
       Password: ###  
       Google_idToken: "#####.googleusercontent.com"
    ports:
       - 80
    volumes:
        - ./images:/app/wwwroot/images  

  db:
    image: mysql:8.0
    restart: always
    volumes:
      - ./mysql:/usr/sbin/mysql
    environment:          
        MYSQL_ROOT_PASSWORD: ###
        MYSQL_DATABASE: AuthUserDB
    ports:
      - 3306:3306
,,,


