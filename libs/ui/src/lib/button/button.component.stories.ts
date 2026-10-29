// Button.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';

import { action } from 'storybook/actions';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    
    name:{
      name: 'label',
    //  defaultValue: 'Hello',
      type: 'string',
      description:"название родительского или дочернего каталога",
      control:{type:'text'}
    },
    id:{
      id:'ID',
      type:'number'

    }
    , 
    flagButtonId:{
      name:"visible id",
      type:"boolean"
    },
    flagButtonOpacity:{
      name:"button opacity",
      type:"boolean"
    }
    ,
    onBtClick: { action: 'clicked' ,return:{id:"10",name:"название категории"}} },
};

export default meta;

export const ButtonUI = {
  render: (args: ButtonComponent) => ({
    props: args,
  }),
  args: {
    id: 10,
    name: "название категории",
    flagButtonId:true,
    flagButtonOpacity:true
  }
  
};


