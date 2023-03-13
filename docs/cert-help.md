# certbot

 ## Init cerbot

  ```
  [ cerbot help](https://certbot.eff.org)
  sudo apt install snapd
  sudo snap install core; sudo snap refresh core
  sudo apt-get remove certbot
  sudo snap install --classic certbot
  ```
  ## Add or reload cert
 
  ```
   certbot certonly  --webroot    -m admin@x-01.ru -d s.x-01.ru
   certbot certonly  --webroot    -m admin@x-01.ru -d xf-01.ru
   //--------------------------------------
   Input the webroot for s.x-01.ru: (Enter 'c' to cancel): nginx/data

   cp  /etc/letsencrypt/live/xf-01.ru/privkey.pem fx-01.ru.key  // copy files
   cp  /etc/letsencrypt/live/xf-01.ru/fullchain.pem fx-01.ru.crt
  ```