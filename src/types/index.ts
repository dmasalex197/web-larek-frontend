// Интерфейс карточки товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Тип оплаты
type Payment = 'онлайн' | 'при получении';

// Типы товара
type CategoryCard =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Интерфейс заказа POST запрос
export interface IOrder {
	payment: Payment;
	email: string;
	phone: number;
	adress: string;
	total: number;
	items: string[];
}

// Интерфейс списка заказов
export interface ICards {
	total: number;
	items: ICard[];
}

// Интерфейсы ошибок API
export interface errorAPI {
	error: string;
}

// Интерфейс подтверждения заказа
export interface ISuccessOrder {
	id: string;
	total: number;
}

// Интерфейс API клиента
export interface ICardAPI {
	getCards: () => Promise<ICards>;
	getCard: (id: string) => Promise<ICard>;
	orderCards: (order: IOrder) => Promise<ISuccessOrder>;
}

// Типы запросов Api
export type ApiMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Интерфейс корзины
export interface IBasket {
	basketTotal: number;
	title: string;
	items: ICard[];
}

// Интерфейс для модели данных товаров
export interface ICardModel {
    cards: ICard[];
    preview: string | null;
    loadCards(): Promise<void>;
    getCardById(cardId: string): Promise<ICard>;
}

// Интерфейс для модели данных корзины
export interface IBasketModel {
    total: number;
    cards: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
    clear(): void;
}
