import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'x01-v1-auth-callback-vk',
  templateUrl: './auth-callback-vk.component.html',
  styleUrls: ['./auth-callback-vk.component.scss'],
})
export class AuthCallbackVkComponent implements OnInit {
  constructor() {
   // ---response identity server -----
  //   https://mh-01.ru/account/auth-callback-vk?
  //   uid=662269659
  //  &first_name=%D0%A6%D1%8B%D0%B3%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2
  //  &last_name=%D0%98%D0%B3%D0%BE%D1%80%D1%8C
  //  &photo=https:%2F%2Fsun2-17.userapi.com%2Fs%2Fv1%2Fig2%2FjStvezSSKrGjMqQF2BXinnDyi6N7TY_6_0l61U6eDBXxviet9MQl5qPZfqcq5Lqa-rVXVHqM81xgl1DfBxt8R8Ta.jpg%3Fsize%3D400x400%26amp;quality%3D96%26amp;crop%3D35,0,630,630%26amp;ava%3D1&photo_rec=https:%2F%2Fsun2-17.userapi.com%2Fs%2Fv1%2Fig2%2F6Gaw21HXcl2P9F0H0uKmpCuabGAY66NH5rP07EuEpmrtL2uwFcM_BihfSSLvALx6qEfZ7xkAZllLiLr_gwu8jEkD.jpg%3Fsize%3D100x100%26amp;quality%3D96%26amp;crop%3D98,63,504,504%26amp;ava%3D1
  //  &hash=ed305a609272a76691a0828b287f089a

  // После авторизации метод VK.Widgets.Auth возвращает данные о пользователе в виде GET-параметров URL при использовании authUrl или в виде параметров функции при использовании onAuth. Возвращаются следующие поля:       
  // uid (integer) — идентификатор пользователя;       
  // first_name (string) — имя;       
  // last_name (string) — фамилия;       
  // photo (string) — URL фотографии профиля пользователя шириной 200px;       
  // photo_rec (string) — URL фотографии профиля пользователя шириной 50px;       
  // hash (string) — служебный параметр, необходимый для проверки авторизации на удаленной стороне.       
  // Для проверки авторизации вы можете использовать полученный параметр hash, сравнив его с md5 подписью от app_id+user_id+secret_key, например md5(667481942537fTanpCrNSeuGPbA4ENCo).       
         
   }

  ngOnInit(): void {}
}
