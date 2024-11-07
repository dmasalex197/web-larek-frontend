import { ISuccess, ISuccessActions } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _close: HTMLButtonElement;
  
    constructor(container: HTMLElement, actions: ISuccessActions) {
      super(container);
  
      this._close = ensureElement<HTMLButtonElement>(
        '.order-success__close',
        this.container
      );
      this._total = ensureElement<HTMLElement>(
        '.order-success__description',
        this.container
      );
  
      if (actions?.onClick) {
        this._close.addEventListener('click', actions.onClick);
      }
    }
  
    set total(value: string) {
      this._total.textContent = `Списано ${value} синапсов`;
    }
  }