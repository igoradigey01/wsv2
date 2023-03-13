## Deploy Angular
```
  ssh root@46.173.223.214
  //deploy
  scp -r C:\Users\Ks34\Documents\AngularProject\xf01\dist\xf01 root@46.173.223.214:~/myapp/nginx/data
  // backup
  scp -r root@46.173.223.214:~/myapp/images  E:\Backup_Host\Backup_images\12-05-22
  ```

## Deploy - Asp core net- on vps
  ### create image_app
  ```
  dotnet restore
  dotnet build
  //delete publish folder
  dotnet publish -c release -o published
  docker-compose down
  // delete old _image    shopapi_web
  docker-compose up
  ```
  
  ### deploy on dockerHub
  docker image push igoradigey01/shopapi_web:latest 
  
  ### deploy on host
  ```
   docker ps 
   docker pull _image_
   docker stop _container_
   docker rm _container_
   //docker run _container 
   docker-compose up web
  ```
  
  ### delete old volume
   ```
   //---- docker-отчет об использовании дискового пространства 
   docker system df 
   docker volume ls 
   docker volume prune // delete volume 
   docker ps 
   ```


## nginx.conf
```
worker_processes auto;
events { worker_connections 1024; }

http{
     types {
               module ;
          }
     include       mime.types;
     default_type  application/octet-stream;
     sendfile on;
     client_max_body_size 10M;
     

       server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        return 301 https://$host$request_uri;
            }
     


      server {
                    
                    listen 443 ssl;
                    listen [::]:443 ssl;
                    server_name xf-01.ru ;
                    resolver 8.8.8.8;
                    ssl_certificate  /etc/nginx/certs/xf-01.ru.crt;
                    ssl_certificate_key   /etc/nginx/certs/xf-01.ru.key;

                          location / {
                                root /var/www/xf01/html;
                                index index.html index.htm;
                                try_files $uri $uri/ /index.html;
                                  }
  
                          location /.well-known {
                                       allow all;
                                       root /usr/share/nginx/html;
                                       index index.html;
                                  }

            }
      server {
                    
                    listen 443 ssl;
                    listen [::]:443 ssl;
                    server_name xl-01.ru ;
                    resolver 8.8.8.8;
                    ssl_certificate  /etc/nginx/certs/xl-01.ru.crt;
                    ssl_certificate_key   /etc/nginx/certs/xl-01.ru.key;

                          location / {
                                root /var/www/xl01/html;
                                index index.html index.htm;
                                try_files $uri $uri/ /index.html;
                                  }
  
                          location /.well-known {
                                       allow all;
                                       root /usr/share/nginx/html;
                                       index index.html;
                                  }

            }      

      server {
                    
                    listen 443 ssl;
                    listen [::]:443 ssl;
                    server_name s.x-01.ru ;
                    resolver 8.8.8.8;
                    ssl_certificate  /etc/nginx/certs/s.x-01.ru.crt;
                    ssl_certificate_key   /etc/nginx/certs/s.x-01.ru.key;

                          location / {
                                        root /var/www/x01/html;
                                        index index.html index.htm;
                                        try_files $uri $uri/ /index.html;
                                  }

                          location /.well-known {
                                      allow all;
                                      root /usr/share/nginx/html;
                                      index index.html;
                                  }

                          
                          location  /images/ {
                                proxy_pass    http://web:80;
                                proxy_http_version 1.1;
                                proxy_set_header   Upgrade $http_upgrade;
                                proxy_set_header   Connection keep-alive;
                                proxy_set_header   Host $host;
                                proxy_cache_bypass $http_upgrade;
                                proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
                                proxy_set_header   X-Forwarded-Proto $scheme;
                                        }

                          location  /api/ {
                                proxy_pass    http://web:80;
                                proxy_http_version 1.1;
                                proxy_set_header   Upgrade $http_upgrade;
                                proxy_set_header   Connection keep-alive;
                                proxy_set_header   Host $host;
                                proxy_cache_bypass $http_upgrade;
                                proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
                                proxy_set_header   X-Forwarded-Proto $scheme;
                                        }
                          
             }      
    } 

```