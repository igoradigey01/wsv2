//https://marketsplash.com/tutorials/typescript/typescript-dictionary/
export interface IDictionary<T =any> {
    [Key: string]: T;  // определение динамических полей
}
 //https://scriptdev.ru/guide/022/#_2
// Синтаксис {[Key: string]: any} 
// является сигнатурой индекса в TypeScript и используется,
// когда мы заранее не знаем всех имен свойств типа и формы значений.

// interface Dictionary {
//     [index: string]: string;
// }
 
// var colors: Dictionary = {};
// colors["red"] = "#ff0000";
// colors["green"] = "#00ff00";
// colors["blue"] = "#0000ff";