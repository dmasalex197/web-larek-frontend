import { Categories, ICardView, ICardActions, TCategory } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class CardView extends Component<ICardView> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._category = ensureElement<HTMLElement>(`.card__category`, container);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: TCategory) {
		this._category.textContent = value;
		this._category.classList.add(Categories[value]);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: string) {
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}
}
