import { AppApi } from './components/AppApi';
import { AppState } from './components/AppData';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IApi, ICard, IEvents } from './types';
import { API_URL, settings } from './utils/constants';

const card: ICard = {
	id: '854cef69-976d-4c2a-a18c-2aa45046c390',
	description: 'Если планируете решать задачи в тренажёре, берите два.',
	image: '/5_Dots.svg',
	title: '+1 час в сутках',
	category: 'софт-скил',
	price: 750,
};

const events: IEvents = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const app = new AppState({}, events);

api
	.getCards()
	.then((data) => {
		app.setCatalog(data);
		console.log(app.catalog);
		app.addCardToBasket(card);
		console.log(app.getTotal());
	})
	.catch((error) => {
		console.log(error);
	});
