import { IActions, ICard } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class CardViewNew extends Component<ICard> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector(`.card__image`);
		this._price = container.querySelector('.card__price');
		this._button = container.querySelector('.card__button');
		this._index = container.querySelector(`.basket__item-index`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this._price.textContent = String(value) + ' синапсов';
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
}
