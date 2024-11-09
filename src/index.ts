import { AppApi } from './components/AppApi';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { CardBasketView } from './components/CardBasket';
import { CardPreview } from './components/CardPreview';
import { CardView } from './components/CardView';
import { Сontacts } from './components/Contacts';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';
import './scss/styles.scss';
import { ICard, ICardView, IEvents, IOrderForm } from './types';
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
const contacts = new Сontacts(cloneTemplate(contactsTemplate), events);

events.on('catalog:changed', () => {
	page.catalog = app.catalog.map((item) => {
		const card = new CardView(cloneTemplate(cardCatalogTemplate), {
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

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			button: app.getPreviewButton(item),
		}),
	});
});

events.on('card:addToBasket', (item: ICard) => {
	app.addCardToBasket(item);
	app.updateOrder();
	page.counter = app.basket.length;
	modal.close();
});

events.on('basket:open', () => {
	basket.total = app.getTotal();
	let indexCard = 1;
	basket.list = app.basket.map((item) => {
		const basketCard = new CardBasketView(cloneTemplate(cardBasketTemplate), {
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
	app.updateOrder();
	page.counter = app.basket.length;
	basket.total = app.getTotal();
	let indexCard = 1;
	basket.list = app.basket.map((item) => {
		const card = new CardBasketView(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:removeFromBasket', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: indexCard++,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('payment:changed', (item: HTMLButtonElement) => {
	app.order.payment = item.name;
	app.validateOrder();
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
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
	app.order.total = app.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		app.setContactsField(data.field, data.value);
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		app.setOrderField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	api
		.orderProducts(app.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: app.getTotal(),
				}),
			});
			app.clearOrder();
			app.clearBasket();
			page.counter = app.basket.length;
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
