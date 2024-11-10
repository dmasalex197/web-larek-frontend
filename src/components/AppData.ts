import IOrder, { FormErrors, IAppState, ICard, TBasketCard, TPreviewCard } from '../types';

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

	addCardToBasket(card: ICard) {
		if (!this.cardInBasket(card)) {
			this.basket.push(card);
			this.emitChanges('basket:changed');
		}
	}

	cardInBasket(card: ICard) {
		return this.basket.some(item => item.id == card.id);
	}

	removeCardFromBasket(card: TBasketCard) {
		const index = this.basket.indexOf(card);
		if (index >= 0) {
			this.basket.splice(index, 1);
			this.emitChanges('basket:changed');
		}
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	clearOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	clearAddressAndPayment() {
		this.order.address = '';
		this.order.payment = '';
	}

	getTotal() {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	setOrderField(field: keyof IOrder, value: string) {

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

	setContactsField(field: keyof IOrder, value: string) {
		this.order[field] = value;
		this.emitChanges('order:changed', this.order);
		
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
