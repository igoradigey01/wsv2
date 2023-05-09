## ChangeDetectionStrategy.OnPush
  1. doc
    - [help-angular-doc-ru](https://angdev.ru/doc/angular-change-detection/#changedetectionstrategy)
    - [help_ru] (https://habr.com/ru/companies/infopulse/articles/358860/)

  2.  Сервис ChangeDetectorRef  // Ручной запуск обнаружения изменений
    
      - detectChanges()  // говорит Angular запустить обнаружение изменений в компоненте и его потомках.
      -  ApplicationRef.tick()  //говорит Angular запустить обнаружение изменений во всем приложении.
      - markForCheck()    //не триггерит запуск обнаружения изменений. Вместо этого он помечает компонент и всех его родителей, что они должны быть проверены в текущем или следующем цикле обнаружения изменений.