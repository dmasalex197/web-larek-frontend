import { ICardView, IApi } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getCards(): Promise<ICardView[]> {
		return this._baseApi
			.get<ICardView[]>(`/product/`)
			.then((cards: ICardView[]) => cards);
	}
}
