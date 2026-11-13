## Patch   for docker-compose  /myapp/VS_Ubuntu/SkladX01/SkladApi
#  Help docker 
 
-  https://habr.com/ru/articles/339610/
- https://andybor.blogspot.com/2021/07/docker-saveload-docker-exportimport.html

1.   images and their metadata
-  docker save [image] > [filename].tar 
 -  или  
 -  docker save -o [filename].tar [image]
 -  docker load -i export.tar
 - docker rmi <image_id>: To delete a specific image

 2. 
 - docker commit c3f279d17e0a    [imaga-name]
 - // docker commit 8ba    shopapi:v2.3
 - docker run --name nginx-dev -p 8080:80 -e TERM=xterm -d nginx-template

3. 
  - docker export 1f1  -o /backup/Docker/mssql-21-06-24.tar
  -  docker import /backup/Docker/mssql-21-06-24.tar  msql-fs
  -  docker import alpine-fs.tar alpine-fs

  4.
  - docker exec -it CONTAINER_ID bash

  //----------------------------------------------------

  - https://www.linuxshop.ru/articles/a26710824-osnovnye_komandy_dlya_docker
  
  '''
docker info - Информация обо всём в установленном Docker
docker history - История образа
docker tag - Дать тег образу локально или в registry
docker login - Залогиниться в registry
docker search - Поиск образа в registry
docker pull - Загрузить образ из Registry себе на хост
docker push - Отправить локальный образ в registry
Управления контейнерами
docker ps -а - Посмотреть все контейнеры
docker start container-name - Запустить контейнер

docker run container-name - создает новый контейнер и сразу включает его. (подробнее отдельно)

docker kill/stop container-name - Убить (SIGKILL) /Остановить (SIGTERM) контейнер

docker logs --tail 100 container-name - Вывести логи контейнера, последние 100 строк

docker inspect container-name - Вся инфа о контейнере + IP

docker rm container-name - Удалить контейнер (поле каждой сборки Dockerfile)

docker rm -f $(docker ps -aq) - Удалить все запущенные и остановленные контейнеры

docker events container-name

docker port container-name - Показать публичный порт контейнера

docker top container-name - Отобразить процессы в контейнере

docker stats container-name - Статистика использования ресурсов в контейнере

docker diff container-name - Изменения в ФС контейнера


Управления образами

docker build -t my_app . - Билд контейнера в текущей папке, Скачивает все слои для запуска образа

docker images / docker image ls - Показать все образы в системе

docker image rm / docker rmi image - Удалить image

docker commit  <containerName/ID> lepkov/debian11slim:version3- Создает образ из контейнера

docker insert URL - вставляет файл из URL в контейнер

docker save -o backup.tar - Сохранить образ в backup.tar в STDOUT с тегами, версиями, слоями

docker load - Загрузить образ в .tar в STDIN с тегами, версиями, слоями

docker import - Создать образ из .tar

docker image history --no-trunc - Посмотреть историю слоёв образа

docker system prune -f - Удалит все, кроме используемого (лучше не использовать на проде, ещё кстати из-за старого кеша может собираться cтарая версия контейнера)
'''



