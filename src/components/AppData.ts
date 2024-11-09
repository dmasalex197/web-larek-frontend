import {
	FormErrors,
	IAppState,
	ICard,
	IOrder,
	IOrderForm,
	TBasketCard,
	TPreviewCard,
} from '../types';

import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	catalog: ICard[];
	preview: string;
	basket: TBasketCard[] = [];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};

	protected formErrors: FormErrors = {};

	setCatalog(catalog: ICard[]) {
		this.catalog = catalog;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	setPreview(card: TPreviewCard) {
		this.preview = card.id;
		this.emitChanges('preview:changed', card);
	}

	getPreviewButton(card: ICard) {
		if (card.price === null) {
			return 'unavailable';
		} else return 'addToBasket';
	}

	addCardToBasket(card: TBasketCard) {
		this.basket.push(card);
	}

	removeCardFromBasket(card: TBasketCard) {
		const index = this.basket.indexOf(card);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}

	clearBasket() {
		this.basket = [];
	}

	clearOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}

	getTotal() {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	updateOrder() {
		this.order.total = this.getTotal();
		this.order.items = this.basket.map((item) => item.id);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
