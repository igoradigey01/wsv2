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

 ### delete old volume
   ```
   //---- docker-отчет об использовании дискового пространства 
   docker system df 
   docker volume ls 
   docker volume prune // delete volume 
   docker ps 
   ```

