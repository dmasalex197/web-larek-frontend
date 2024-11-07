import { ICardActions, ICardBasketView } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class CardBasketView extends Component<ICardBasketView> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;
  
    constructor(container: HTMLElement, actions?: ICardActions) {
      super(container);
  
      this._title = ensureElement(`.card__title`, container);
      this._price = ensureElement(`.card__price`, container);
      this._index = ensureElement(`.basket__item-index`, container);
      this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);
  
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
      this._price.textContent = String(value) + ' синапсов';
    }
  }