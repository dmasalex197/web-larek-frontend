import {
	ICard,
	IOrder,
	IOrderResult,
	IGetCardsResponse,
	IAppAPI,
} from '../types';
import { Api } from './base/api';

export class AppApi extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);

		this.cdn = cdn;
	}

	getCards(): Promise<ICard[]> {
		return this.get('/product').then((data: IGetCardsResponse) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
