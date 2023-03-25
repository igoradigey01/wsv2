import { Component ,OnInit } from '@angular/core';
import {VkLoginWidgetService} from '../_shared/services/vk-login-widger.service'

@Component({
  selector: 'x01-v1-VK-login-widget',
  templateUrl: './vk-login-widget.component.html',
  styleUrls: ['./vk-login-widget.component.scss'],
})
export class VkLoginWidgetComponent implements OnInit {

  constructor(
   private repozitory:VkLoginWidgetService
  ) {
    
  }

  ngOnInit(): void {

   this.repozitory.loadWidgetScript();
  }

}
