import { AppApi } from './components/AppApi';
import { AppState } from './components/AppData';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { CardBasketView } from './components/CardBasket';
import { CardPreview } from './components/CardPreview';
import { CardView } from './components/CardView';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IApi, IEvents } from './types';
import { API_URL, settings } from './utils/constants';
import { cardItem } from './utils/tempConstants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events: IEvents = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const app = new AppState({}, events);

api
	.getCards()
	.then((data) => {
		app.setCatalog(data);
		console.log(app.catalog);
		app.addCardToBasket(cardItem);
		console.log(app.getTotal());
	})
	.catch((error) => {
		console.log(error);
	});

const gallery: HTMLElement = document.querySelector('.gallery');
const cardView: HTMLElement = document.querySelector('.card');
const cardBasket: HTMLElement = document.querySelector('.card_compact');
const modal: HTMLElement = document.querySelector('.modal');

const cardClassView: CardView = new CardView(cardView);
console.log(cardClassView);

const cardClassPreview: CardPreview = new CardPreview(cardView);
console.log(cardClassPreview);


gallery.append(cardClassView.render());
