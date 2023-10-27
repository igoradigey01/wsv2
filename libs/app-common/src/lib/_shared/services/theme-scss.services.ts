import { Injectable } from '@angular/core';
import { IThemeScss } from '../interfaces/theme-scss.model'





@Injectable()
export class ThemeScssServices {

    private var_scc: IThemeScss | undefined;

    private supportsCustomProps; // поддерживает ли браузер работу переменными CSS
    constructor() { 
      this.supportsCustomProps = CSS.supports('--primary-text: #000');

        // Logs true to the console in browsers that support custom properties
        //https://www.sitepoint.com/how-to-use-variables-in-css/
       //  console.log(this.supportsCustomProps);
    }

    /** вызывать в  constructor(),ngOnInit() this function not work !!!  */
    public initThemeComponent(theme_scc: IThemeScss) {

     if(this.supportsCustomProps){

        this.saveOldTheme();
        this.setDocumentCssVar(theme_scc);
     }

    }

    
    public destroyThemeComponent() {

        if(this.supportsCustomProps){

        if (this.var_scc) {
            this.setDocumentCssVar(this.var_scc);
        }
    }

    }

    private setDocumentCssVar(let_css: IThemeScss) {


        if (let_css) {
            if (let_css.primary_color) {

                document.body.style.setProperty("--primary-color", let_css.primary_color);
                let_css.primary_color = undefined;

            }

            if (let_css.primary_lighter_color) {

                document.body.style.setProperty("--primary-lighter-color", let_css.primary_lighter_color);
                let_css.primary_lighter_color = undefined;

            }

            if (let_css.primary_darker_color) {

                document.body.style.setProperty("--primary-darker-color", let_css.primary_darker_color);
                let_css.primary_darker_color = undefined;

            }

            if (let_css.on_primary_color) {

                document.body.style.setProperty("--on-primary-color", let_css.on_primary_color);
                let_css.on_primary_color = undefined;

            }

            if (let_css.on_primary_lighter_color) {

                document.body.style.setProperty("--on-primary-lighter-color", let_css.on_primary_lighter_color);
                let_css.on_primary_lighter_color = undefined;

            }

            if (let_css.accent_color) {

                document.body.style.setProperty("--accent-color", let_css.accent_color);
                let_css.accent_color = undefined;

            }

            if (let_css.accent_lighter_color) {

                document.body.style.setProperty("--accent-lighter-color", let_css.accent_lighter_color);
                let_css.accent_lighter_color = undefined;

            }
            if (let_css.accent_darker_color) {

                document.body.style.setProperty("--accent-darker-color", let_css.accent_darker_color);
                let_css.accent_darker_color = undefined;

            }

            if (let_css.on_accent_color) {

                document.body.style.setProperty("--on-accent-color", let_css.on_accent_color);
                let_css.on_accent_color = undefined;

            }

            if (let_css.on_accent_lighter_color) {

                document.body.style.setProperty("--on-accent-lighter-color", let_css.on_accent_lighter_color);
                let_css.on_accent_lighter_color = undefined;

            }


            if (let_css.tertiary_color) {

                document.body.style.setProperty("--tertiary-color", let_css.tertiary_color);
                let_css.tertiary_color = undefined;

            }

            if (let_css.tertiary_container_color) {

                document.body.style.setProperty("--tertiary-container-color", let_css.tertiary_container_color);
                let_css.tertiary_container_color = undefined;

            }

            if (let_css.on_tertiary_color) {

                document.body.style.setProperty("--on-tertiary-color", let_css.on_tertiary_color);
                let_css.on_tertiary_color = undefined;

            }

            if (let_css.on_tertiary_container_color) {

                document.body.style.setProperty("--on-tertiary-container-color", let_css.on_tertiary_container_color);
                let_css.on_tertiary_container_color = undefined;

            }

            if (let_css.background) {

                document.body.style.setProperty("--background", let_css.background);
                let_css.background = undefined;

            }

            if (let_css.on_background) {

                document.body.style.setProperty("--on-background", let_css.on_background);
                let_css.on_background = undefined;

            }

            if (let_css.surface_color) {

                document.body.style.setProperty("--surface-color", let_css.surface_color);
                let_css.surface_color = undefined;

            }

            if (let_css.on_surface_color) {

                document.body.style.setProperty("--on-surface-color", let_css.on_surface_color);
                let_css.on_surface_color = undefined;

            }

            if (let_css.surface_variant_color) {

                document.body.style.setProperty("--surface-variant-color", let_css.surface_variant_color);
                let_css.surface_variant_color = undefined;

            }


            if (let_css.on_surface_variant_color) {

                document.body.style.setProperty("--on-surface-variant-color", let_css.on_surface_variant_color);
                let_css.on_surface_variant_color = undefined;

            }

            if (let_css.outline_color) {

                document.body.style.setProperty("--outline-color", let_css.outline_color);
                let_css.outline_color = undefined;

            }


        }
    }


    private saveOldTheme() {

       const bodyStyles = window.getComputedStyle(document.body);
       const  tertiary_color= bodyStyles.getPropertyValue('--tertiary-color'); //ge
        console.log("saveOldTheme-tertiary_color--"+tertiary_color); 
        this.var_scc = <IThemeScss>{
            primary_color: bodyStyles.getPropertyValue("--primary-color"),
            primary_lighter_color: bodyStyles.getPropertyValue("--primary-lighter-color"),
            primary_darker_color: bodyStyles.getPropertyValue("--primary-darker-color"),

            on_primary_color: bodyStyles.getPropertyValue("--on-primary-color"),
            on_primary_lighter_color: bodyStyles.getPropertyValue("--on-primary-lighter-color"),

            accent_color: bodyStyles.getPropertyValue("--accent-color"),
            accent_lighter_color: bodyStyles.getPropertyValue("--accent-lighter-color"),
            accent_darker_color: bodyStyles.getPropertyValue("--accent-darker-color"),

            on_accent_color: bodyStyles.getPropertyValue("--on-accent-color"),
            on_accent_lighter_color: bodyStyles.getPropertyValue("--on-accent-lighter-color"),

            tertiary_color: bodyStyles.getPropertyValue("--tertiary-color"),
            tertiary_container_color: bodyStyles.getPropertyValue("--tertiary-container-color"),
            on_tertiary_color: bodyStyles.getPropertyValue("--on-tertiary-color"),
            on_tertiary_container_color: bodyStyles.getPropertyValue("--on-tertiary-container-color"),

            background: bodyStyles.getPropertyValue("--background"),
            on_background: bodyStyles.getPropertyValue("--on-background"),

            surface_color: bodyStyles.getPropertyValue("--surface-color"),
            on_surface_color: bodyStyles.getPropertyValue("--on-surface-color"),
            surface_variant_color: bodyStyles.getPropertyValue("--surface-variant-color"),
            on_surface_variant_color: bodyStyles.getPropertyValue("--on-surface-variant-color"),

            outline_color: bodyStyles.getPropertyValue("--outline-color")


        }

    }
}