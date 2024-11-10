import { AppApi } from './components/AppApi';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';

import { CardPreview } from './components/CardPreview';
import { CardViewNew } from './components/CardViewNew';
import { Contacts } from './components/Contacts';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';
import './scss/styles.scss';
import IOrder, { ICard, ICardView, IEvents } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events: IEvents = new EventEmitter();
const api = new AppApi(API_URL, CDN_URL);
const modal = new Modal(ensureElement('#modal-container'), events);
const page = new Page(document.body, events);
const app = new AppState({}, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

events.on('catalog:changed', () => {
	page.catalog = app.catalog.map((item) => {
		const card = new CardViewNew(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: ICardView) => {
	app.setPreview(item);
});

events.on('preview:changed', (item: ICardView) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:addToBasket', item),
	});

	let buttonInfo: undefined | string;

	if (app.cardInBasket(item)) {
		buttonInfo = 'notAddToBasket';
	} else if (item.price === null) {
		buttonInfo = 'unavailable';
	} else {
		buttonInfo = 'addToBasket';
	}

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			button: buttonInfo,
		}),
	});
});

events.on('card:addToBasket', (item: ICard) => {
	app.addCardToBasket(item);
	page.counter = app.basket.length;
	modal.close();
});

events.on('basket:changed', () => {
	page.counter = app.basket.length;
	basket.render({
		total: app.getTotal(),
	});
});

events.on('basket:open', () => {
	let indexCard = 1;
	basket.list = app.basket.map((item) => {
		const basketCard = new CardViewNew(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:removeFromBasket', item),
		});
		return basketCard.render({
			title: item.title,
			price: item.price,
			index: indexCard++,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

events.on('card:removeFromBasket', (item: ICard) => {
	app.removeCardFromBasket(item);
	page.counter = app.basket.length;
	basket.total = app.getTotal();
	let indexCard = 1;
	basket.list = app.basket.map((item) => {
		const card = new CardViewNew(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:removeFromBasket', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: indexCard++,
		});
	});
});

events.on('order:changed', () => {
	order.render({
		payment: '',
		address: '',
		valid: false,
		errors: [],
	});
});

events.on('order:open', () => {
	const orderData = app.order;
	app.clearAddressAndPayment();
	modal.render({
		content: order.render({
			payment: orderData.payment,
			address: orderData.address,
			valid: false,
			errors: [],
		}),
	});
});

events.on('payment:changed', (item: HTMLButtonElement) => {
	app.order.payment = item.name;
	app.validateOrder();
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	const contactsData = app.order;
	modal.render({
		content: contacts.render({
			email: contactsData.email,
			phone: contactsData.email,
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		app.setContactsField(data.field, data.value);
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		app.setOrderField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	const orderWithTotal = {
		...app.order,
		total: app.getTotal(),
		items: app.basket.map((item) => item.id),
	};
	api
		.orderProducts(orderWithTotal)
		.then(() => {
			success;
			modal.render({
				content: success.render({
					total: app.getTotal(),
				}),
			});
			app.clearOrder();
			app.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

api
	.getCards()
	.then((data) => {
		app.setCatalog(data);
	})
	.catch((error) => {
		console.log(error);
	});
