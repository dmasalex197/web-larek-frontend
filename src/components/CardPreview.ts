import { ICardActions } from '../types';
import { ensureElement } from '../utils/utils';
import { CardViewNew } from './CardViewNew';

export class CardPreview extends CardViewNew {
	protected _text: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._button = container.querySelector(`.card__button`);
		this._text = ensureElement<HTMLElement>(`.card__text`, container);

		if (actions?.onClick) {
			if (this._button) {
				container.removeEventListener('click', actions.onClick);
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set text(value: string) {
		this.setText(this._text, value);
	}

	set button(value: string) {
		if (value === `unavailable`) {
			this.setText(this._button, 'Невозможно приобрести');
			this.setDisabled(this._button, true);
		} else if (value === 'notAddToBasket') {
			this.setText(this._button, 'Товар в корзине');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._button, 'Добавить в корзину');
		}
	}
}
