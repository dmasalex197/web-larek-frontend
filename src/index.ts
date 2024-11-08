import { AppApi } from './components/AppApi';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { CardPreview } from './components/CardPreview';
import { CardView } from './components/CardView';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import './scss/styles.scss';
import { ICardView, IEvents } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events: IEvents = new EventEmitter();
const api = new AppApi(API_URL, CDN_URL);
const modal = new Modal(ensureElement('#modal-container'), events);
const page = new Page(document.body, events);
const appData = new AppState({}, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

events.on('catalog:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CardView(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('product:select', (item: ICardView) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: ICardView) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('product:addToBasket', item),
	});

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			button: appData.getPreviewButton(item),
		}),
	});
});

api
	.getCards()
	.then((data) => {
		appData.setCatalog(data);
	})
	.catch((error) => {
		console.log(error);
	});
