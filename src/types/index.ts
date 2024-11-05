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
type Payment = 'онлайн' | 'при получении';

// Интерфейс заказа
export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: string | number;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

type EventName = string | RegExp;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс Api
export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс получения списка карточек и отправки заказа на сервер
export interface ICardApi {
	getCardList: () => Promise<ICard[]>;
	orderCards: (order: IOrder) => Promise<IOrderResult>;
}

export interface IGetCardsResponse {
	total: number;
	items: ICard[];
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

// Интерфейс всего приложения, описывает данные cтраницы
export interface IAppState {
	catalog: ICard[];
	preview: string | null;
	basket: string[];
	order: IOrder;
	total: string | number;
	loading: boolean;
	setCatalog(catalog: ICard[]): void;
	setPreview(card: TPreviewCard): void;
	getPreviewButton(card: ICard): void;
	addCardToBusket(card: TBasketCard): void;
	removeCardFromBusket(card: TBasketCard): void;
	clearBasket(): void;
	clearOrder(): void;
	getTotal(): number;
	updateOrder(): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
	setContactsField(field: keyof IOrderForm, value: string): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
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

// Тип данных, находящихся в корзине
export type TBasketCard = Pick<ICard, 'title' | 'price' | 'id'>;

// Тип данных, при просмотре продукта
export type TPreviewCard = Pick<
	ICard,
	'title' | 'image' | 'description' | 'price' | 'id'
>;

// Тип формы оплаты
export type TPaymentForm = Pick<IOrder, 'payment' | 'address'>;

// Тип формы контактов
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

// Тип ошибки заказа
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TCardApi = Pick<ICard, 'id'>;
