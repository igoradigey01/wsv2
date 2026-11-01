# Create docker  deploy on local-mashine
``` 
 add file docker-compose.yml
 add folder nginx 
```
###  static page index.html
``` http://localhost:8080/test/

      //docker-compose.yml
   - ./dist/static/html:/var/www/html/test
```

###  angular app
```  http://localhost:8080
      
      //docker-compose.yml
    - ./dist/apps/x01:/var/www/html
```

###  storybook page
```  http://localhost:8000
      
      //docker-compose.yml
    - ./dist/storybook/ui:/var/www/sb/html
```

 ### delete old volume
   ```
   //---- docker-отчет об использовании дискового пространства 
   docker system df 
   docker volume ls 
   docker volume prune // delete volume 
   docker ps 
   ```

    ### deploy on host
  ```
   docker ps 
   docker pull _image_
   docker stop _container_
   docker rm _container_
   //docker run _container 
   docker-compose up web
  ```