## Настраиваем firewall
```
Устанавливаем удобный брандмауэр UFW.
sudo apt install ufw

Если происходило переподключение, то система запросит пароль нового администратора.
Установим защиту от брутфорса паролей:
apt install -y fail2ban

Запрещаем все входящие подключения.
sudo ufw default deny incoming

Делаем исключение для удалённого управления.
sudo ufw allow ssh

Разрешаем все исходящие подключения.
sudo ufw default allow outgoing

Активируем брандмауэр.
sudo ufw enable

На запрос подтверждения вводим “y”.

Проверяем правильность настройки.
sudo ufw status verbose
https://ruvds.com/ru/helpcenter/telegram-bot-dlya-ruvds/

```