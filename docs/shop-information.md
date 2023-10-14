# shop-information lib

```
-все данные для библиотеки задаются в
assets/company_information/company_information.json
-задаем  provider  companyInformationService используя APP_INITIALIZER
 app/main.ts
 - пользуемся в библиотеке
 constructor(
       private repository:CompanyInformationService
      ) {}
```





## About

### yandex-maps

```
npm install angular8-yandex-maps
https://github.com/ddubrava/angular8-yandex-maps#readme
```

### Задаталь координаты в

```
assets/company_information/company_information.json
"yandex_point":{"x":"44.687199","y":"39.977717"},
```

### Create in main.ts

```{provide: APP_INITIALIZER,
    useFactory: () => {

      const companyInformationService = inject(CompanyInformationService);
      const http = inject(HttpClient);
      return () =>
        new Promise((resolve) => {
          http
            .get<ICompanyInformation>('assets/company_information/company_information.json')
            .pipe(
              tap((data: ICompanyInformation) => {

                companyInformationService.company_guarantees = data.company_guarantees;
                companyInformationService.company_logo = data.company_logo;
                companyInformationService.company_activities = data.company_activities;
                companyInformationService.company_copyright = data.company_copyright;
                companyInformationService.company_lunch_time = data.company_lunch_time;
                companyInformationService.company_name = data.company_name;
                companyInformationService.company_normalize_phone = data.company_normalize_phone;
                companyInformationService.company_phone = data.company_phone;
                companyInformationService.company_photo = data.company_photo;
                companyInformationService.company_time_create = data.company_time_create;
                companyInformationService.company_work_time = data.company_work_time;
                companyInformationService.yandex_point = data.yandex_point;

                /*  for (const key  in  data) {
                  if (companyInformationService.hasOwnProperty(key)) {

                   //  Object.entries(companyInformationService).map(([comp_key, value])=>{
                   //   if(key==comp_key){
                   //     value=data[key as keyof ICompanyInformation];
                   //     console.log(`${comp_key} ${value}`);
                   //   }
                   //  })

                   // Object.entries(companyInformationService).forEach(([comp_key, value]) => {
                   //  // console.log(`${comp_key} ${value}`); // "a 5", "b 7", "c 9"
                   //   if(key==comp_key){
                   //     value=data[key as keyof ICompanyInformation];
                   //     console.log(`${comp_key} ${value}`)

                   //   }
                   // });

                   //https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
                    // console.log("--promise is ok--" + key +":",companyInformationService[key as keyof ICompanyInformation])
                   }
                  } */

                resolve(true);
              }))
            .subscribe();
          resolve(true)
        });
    }

    , multi: true
 },
```

### create obj repository:CompanyInformationService for app

```app/app.component.ts
 constructor(
       private repository:CompanyInformationService
      ) {}
```

### использовать в about.component.ts

```
  libs/shop-information/src/lib/about/about.component.ts
   constructor(
       private repository:CompanyInformationService
      ) {}
```
