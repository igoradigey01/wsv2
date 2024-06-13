import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CartPresentationComponent } from './cart-presentation.component';
import { HttpClientModule } from '@angular/common/http';
//import { AppHeaderLayoutComponent } from '@wsv2/ui'

const meta: Meta<CartPresentationComponent> = {

  title: 'Корзина',
  component: CartPresentationComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientModule,
       // AppHeaderLayoutComponent
      //  RouterModule
      ],
    }),
  ],
  
 

 
};

export default meta;





type Story = StoryObj<CartPresentationComponent>;

export const CartPresentationUI: Story = {
  args: {
    flagView:false,
    flagOpt:false,
    serverUrl:'https://s.x-01.ru/',
    
  },

};
