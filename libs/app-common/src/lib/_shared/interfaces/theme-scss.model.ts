export interface IThemeScss {
    primary_color: string | undefined;
    primary_lighter_color: string | undefined;
    primary_darker_color: string | undefined;

    on_primary_color: string|undefined;
    on_primary_lighter_color:string|undefined;

    accent_color: string | undefined;
    accent_lighter_color: string | undefined;
    accent_darker_color: string | undefined;

    on_accent_color: string|undefined;
    on_accent_lighter_color:string|undefined;

    tertiary_color: string | undefined;
    tertiary_container_color: string | undefined;
    on_tertiary_color: string | undefined;
    on_tertiary_container_color: string | undefined;

    background: string | undefined;
    on_background: string | undefined;

    surface_color: string | undefined;
    on_surface_color: string | undefined;
    surface_variant_color: string | undefined;
    on_surface_variant_color: string | undefined;

    outline_color: string | undefined;

}