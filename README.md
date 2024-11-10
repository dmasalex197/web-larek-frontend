# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание сайта (процессы в проекте)
* На главной странице список товаров;
* Модальное окно с детальным описанием товара;
* Возможность положить товар в корзину, если он не был добавлен раньше (удалить из нее товар);
* Корзина, товары в ней;
* Заказ: адрес, способ оплаты, почта и телефон покупателя, 
* После оплаты товар удаляется из корзины

## Классы, типы и интерфейсы

### Интерфейс карточки товара
```ts
interface ICard {
	id: string;
	description: string;
	image: string;
  title: string;
  category: string;
	price: number | null;
}
```
### Интерфейс заказа
```ts
interface IOrder {
    payment: Payment;
    email: string;
    phone: number;
	  adress: string;
}
```
### Интерфейс Api
```ts
interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```
### Интерфейс брокера событий
```ts
interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```
### Интерфейс ответа сервера заказа
```ts
interface IOrderResult {
  id: string;
}
```
### Интерфейс получения списка карточек и отправки заказа на сервер
```ts
interface ICardApi {
  getCardList: () => Promise<ICard[]>;
  orderCards: (order: IOrder) => Promise<IOrderResult>;
}
```
### Интерфейс всего приложения, описывает данные cтраницы
```ts
interface IAppState {
  catalog: ICard[];
  basket: string[];
  preview: string | null;
  order: IOrder;
  loading: boolean;
}
```
### Интерфейс Страницы
```ts
interface IPage {
  counter: number;
  catalog: number;
  locked: boolean;
}
```

### Интерфейс отображения товара в корзине
```ts
interface ICardBasketView {
  title: string;
  price: number;
  index: number;
}
```
### Интерфейс отображения корзины
```ts
interface IBasketView {
  list: HTMLElement[];
  total: number;
}
```
### Интерфейс модального окна
```ts
interface IModalData {
  content: HTMLElement;
}
```
### Интерфейс класса Form
```ts
interface IForm {
  errors: string[];
  valid: boolean;
}
```
### Интерфейс ответа успешного заказа
```ts
interface ISuccess {
  total: number;
}
```

### Тип данных, находящихся в корзине
```ts
type TBasketItem = Pick<ICard, 'title' | 'price' | 'id'>;
```

### Тип данных, при просмотре продукта
```ts
type TPreviewItem = Pick<ICard, 'title' | 'image' | 'description' | 'price' | 'id'>;
```

### Тип формы оплаты
```ts
type TPaymentForm = Pick<IOrder, 'payment' | 'address'>;
```

### Тип формы контактов
```ts
type TContactsForm = Pick<IOrder, 'email' | 'phone'>;
```

### Тип ошибки заказа
```ts
type FormErrors = Partial<Record<keyof IOrder, string>>;
```
### Массив карточек товаров
```ts
interface ICardsData = {
  cards: ICard[];
  preview: string | null;
}
```


## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP.
- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение данных;
- презентер,отвечает за связь представления и данных.

## Базовый код

### Класс `API`
Содержит в себе базовую логику отправки запросов.
В конструктор передается базовый адрес сервера (`baseUrl`) и опциональный объект с заголовками запросов.  
Методы:
- `get` - выполняет запрос на переданной в параметрах ендпоинт и возвращает промис с объектом,которым ответил сервер.
- `post`- принимает объект с данными,которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponse` - обработка ответа с сервера (преобразование тела ответа в JSON-объект);

### класс `Model`
Абстрактный класс дженерик, обобщающий метод регистрации события.  
Метод:
- `emitChanges` — регистрирует входящее событие в EventEmitter

### класс `Component`
Абстракный класс является родителем всех компонентов в слое представления. С помощью generic принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. С помощью костроктора создает элемент разметки, являющийся основным родительским контейнером компонента. 
В контрукторе инициализируется DOM-элемент куда будет помещен нужный компонент.
 - переключает у елемента класс
 - устанавливает тектовое содержимое (textContent)
 - меняет статус блокировки
 - метод render, сохраняет данные в полях компонента, возвращает обновленный контейнер компонента.

###  Класс `EventEmitter`
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. Реализует интерфейс IEvents, в параметры конструктора ничего не передается.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие  


## Слой данных

### Класс `CardApi`

Класс для получения списка товаров и отправки данных заказа. Наследуется от базового класса `Api` (интерфейс `ICardApi`). Поля класса:

- url - хранит входящий url

Конструктор:

- принимает и передает в родительский конструктор Api поля baseUrl и options
- принимает и сохраняет входящий url

Методы:

- getCardList — метод получения списка товаров с сервера
- orderCards — метод отправки данных заказа на сервер

### Класс `AppState`
Содержит в себе все основные группы данных страницы и методы работы с ними.
Наследуется от базового абстрактного класса `Model<T>` (интерфейс `IAppState`).

Поля класса:

- catalog - список товаров
- preview - карточка просмотра товара
- basket - корзина покупок
- order - заказ, который отправляется на сервер
- formErrors - для данных ошибок формы

Методы:

- setCatalog - установить каталог товаров
- setPreview- установить товар в просмотр
<!-- - getPreviewButton - получение состояния кнопки -->
- addCardToBusket - добавить товар в корзину
- removeCardFromBusket - убрать товар из корзины
- clearBasket - очистить данные корзины
- clearOrder - очистить данные заказа
- getTotal - получить сумму заказа
<!-- - updateOrder - обновить данные заказа -->
- setOrderField - устанавливает данные в форму заказа
- setContactsField - устанавливает данные в форму контактов
- validateOrder - провести валидацию формы заказа
- validateContacts - провести валидацию формы контактов

## Слой представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент)
передаваемых в них данных.

### Класс `Page`
Класс отвечает за отображение всех элементов страницы: корзины, счетчика корзины, каталога товаров.
Наследуется от базового абстрактного класс `Component<T>` (интерфейс `IPage`).

Поля класса:
- counter - счетчик корзины
- catalog - хранение разметки каталога карточек
- wrapper - хранение разметки обёртки страницы
- buttonBasket - хранение разметки кнопки корзины

Конструктор:

- принимает container типа HTMLElement и объект event типа IEvent
- передает container в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает на кнопку корзины buttonBasket слушатель события click, при котором регистрируется событие открытие корзины

Методы класса:

- setCatalog - отвечает за установку каталога
- setCounter - отвечает за установку счетчика
- setIsLocked - отвечает за блокироку прокрутки страницы


### Класс `Card`

Класс отвечает за отображение данных карточки товара в каталоге. Наследуется от базового абстрактного класс `Component<T>` (интерфейс `ICard`).

Поля:

- title - названия карточки
- category - разметка категории карточки
- image - разметка изображения карточки
- price - разметка цены карточки

Конструктор:
- принимает container типа `HTMLElement` и объект `event` типа `IEvent`.
- передает `container` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы:

- setTitle - устанавливает название товара
- setCategory - устанавливает данные категории товара
- setImage - устанавливает данные изображение
- setPrice - устанавливает данные цены товара

### Класс `CardPreview`

Класс отображает превью выбранного товара. Наследуется от класса `Card`.

Поля:

- text - хранит разметку описания
- button - хранит разметку кнопки "В корзину"

Конструктор:

- принимает `container` типа `HTMLElement` и объект `event` типа `IEvent`.
- передает `container` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы:

- setText - установка содержимого описания
- setButton- установка содержимого кнопки

### Класс `CardBasket`

Класс отвечает за отображение данных товара в корзине. Наследуется от базового абстрактный класс `Component<T>` (интерфейс `ICardBasket`).

Поля:

- title - хранит разметку названия товара
- price - хранит разметку цены товара
- button - хранит разметку кнопки товара
- index - хранит разметку индекса товара

Конструктор:

- принимает `container` типа `HTMLElement` и объект `event` типа `IEvent`.
- передает `container` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы:

- setIndex - установка данных индекса
- setTitle - установка данных названия
- setPrice - установка данных цены

### Класс `Basket`

Класс отображения корзины: кнопки сабмита, полной стоимости. Наследуется от базового абстрактного класса `Component<T>` (Интерфейс `IBasketView`).

Поля:
- list - хранит разметку листа карточек (товаров)
- total - хранит разметку обертки полной стоимости
- button - хранит разметку кнопки "оформить"

Конструктор:

- принимает `container` типа HTMLElement и `event` типа IEvent
- записывает данные в поля
- передает `container` в родительский класс (конструктор)
- вешает слушатель на кнопку сабмита

Методы:

- setList - устанавливает карточки в разметку
- setTotal - итоговая сумма

### Класс `Modal`

Принимает разметку модального окна, отвечает за отображение содержимого таких элементов (модальных окон). Наследуется от базового абстрактного класса `Component<T>` (Интерфейс `IModalData`).  Поля:

- content - хранение разметки контента модального окна
- closeButton - хранение кнопки закрытия модального окна

Конструктор:

- принимает `сontainer` с типом HTMLElement и `event` с типом IEvent
- передает `container` в родительский конструктор
- записывает нужные данные в поля класса
- вешает слушатель клика

Методы:

- setСontent - устанавливает содержимое модального окна
- open - открывает модальное окно
- close - закрывает модально окно
- render - отрисовывает контент и открывает модальное окно

### Класс `Form`

Класс отвечает за обертку форм с данными, работу с ними. Наследуется от абстрактного класса `Component<T>` (Интерфейс `IForm`).

Поля:

- errors - разметка поля ошибок input
- submit - хранит разметку кнопки сабмита

Конструктор:

- принимает `сontainer` с типом HTMLElement и `event` с типом IEvent
- передает `container` в родительский конструктор
- записывает данные в поля класса
- добавляет слушатели на сабмит и инпуты

Методы:

- onInputChange - фиксирует изменения в инпутах
- setValid - устанавливает валидность формы
- setErrors - устанавливает ошибки
- render - отрисовывает форму

### Класс `Order`

Класс отвечает за модальное окно заказа - "СПОСОБ ОПЛАТЫ". Наследуется от класса `Form`.

Поля:

- buttonn — разметка кнопки формы оплаты

Конструктор:

- принимает `container:HTMLElement` и объект `event:IEvent`
- передает `container`, `events` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы

- setPayment — устанавливает класс активности на кнопку типа оплаты
- setAddress — устанавливает значение поля адрес

### Класс `Contacts`

Отвечает модальное окно заказа - АДРЕС ДОСТАВКИ. Наследуется от класса `Form`..

Конструктор:

- принимает `container:HTMLElement` и объект `event:IEvent`
- передает `container`, `events` в родительский конструктор

Методы:

- setEmail - input почты
- setPhone - input телефона

### Класс `Success`

Класс нужен для отображения данных успешного заказа. Наследуется от абстрактного класса `Component<T>` (Интерфейс `ISuccess`).

Поля:

- total - разметка общей суммы товаров
- close - разметка кнопки закрытия окна

Конструктор:

- принимает `container:HTMLElement` и `actions:ISuccessActions`.
- передает `container` в родительский конструктор
- сохраняет необходимые данные в поля класса
- вешает слушатель на кнопку `close`

Методы:

- `setTotal` - установка полной стоимости

## Взаимодействие компонентов (Presenter)
Код, описывающий взаимодействие представления и данных между собой находится в файле index.ts, выполняющем роль презентера. Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков событий, описанных в index.ts.  В index.ts сначала создаются экземпляры событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts  

Список всех событий, генерируемых в системе:

- `catalog:changed` - изменение массива товаров
- `card:select` - изменение открываемого в модальном окне товара
- `card:addToBasket` - добавление товара в корзину
- `basket:open` - открытие корзины
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `preview:changed` - изменение данных товара для показа в модальном окне предпросмотра
- `order:open` - подтверждение товаров в корзине
- `order:change` - изменение данных в форме с информацией заказа
- `contacts:input` - изменение данных в форме с контактами пользователя
- `order:submit` - сохранение данных о заказе в форме
- `contacts:submit` - сохранение данных о контактах пользователя в форме
- `order:ready` - событие после выполнения валидации формы заказа
- `contacts:ready` - событие после выполнения валидации формы контактов пользователя