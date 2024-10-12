// Интерфейс карточки товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Способ оплаты
type Payment = 'онлайн'| 'при получении';

// Интерфейс заказа
export interface IOrder {
	payment: Payment;
	email: string;
	phone: number;
	adress: string;
	total: number;
}

type EventName = string | RegExp;
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс Api
export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс брокера событий
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

// Интерфейс ответа сервера заказа
export interface IOrderResult {
	id: string;
}

// Интерфейс получения списка карточек и отправки заказа на сервер
export interface ICardApi {
	getCardList: () => Promise<ICard[]>;
	orderCards: (order: IOrder) => Promise<IOrderResult>;
}

// Интерфейс всего приложения, описывает данные cтраницы
export interface IAppState {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder;
	total: string | number;
	loading: boolean;
}

// Интерфейс Страницы
export interface IPage {
	counter: number;
	catalog: number;
	locked: boolean;
}

// Интерфейс Карточки товара
export interface ICardView {
	id: string;
	title: string;
	category: string;
	image: string;
	price: number;
	text: string;
}

// Интерфейс отображения товара в корзине

export interface ICardBasketView {
	title: string;
	price: number;
	index: number;
}

// Интерфейс отображения корзины
export interface IBasketView {
	list: HTMLElement[];
	total: number;
}

// Интерфейс модального окна
export interface IModalData {
	content: HTMLElement;
}

// Интерфейс класса Form
interface IForm {
	errors: string[];
	valid: boolean;
}

// Интерфейс ответа успешного заказа
interface ISuccess {
	total: number;
}
