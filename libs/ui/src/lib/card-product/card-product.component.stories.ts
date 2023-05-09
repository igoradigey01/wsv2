import type { Meta, StoryObj } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { CardProductComponent } from './card-product.component';


const meta: Meta<CardProductComponent> = {
    title: 'Card-Product',
    component: CardProductComponent,
    argTypes: {
    }

};

export default meta;

export const CardProductUI = {
    render: (args: CardProductComponent) => ({
        props: args,
    }),
    args: {

    }

};
