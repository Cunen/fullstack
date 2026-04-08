import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sendClickEvent } from "./events/events";

/** Button Component
 *
 * @event {MouseEvent} onclick - Dispatches [MouseEvent] when clicked
 */
@customElement("c-button")
export class WebButton extends LitElement {
  static styles = [
    css`
      :host {
        width: fit-content;
        height: fit-content;
        max-width: 100%;
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ccc;
        background-color: white;
        border-radius: 4px;
        height: 32px;
        padding: 0 12px;
      }
    `,
  ];

  /** Text of the button
   * @attr text
   */
  @property({ type: String }) text = "";

  private handleClick = (e: MouseEvent) => {
    sendClickEvent(this, e);
  };

  render() {
    return html`<button @click=${this.handleClick}>${this.text}</button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "c-button": WebButton;
  }
}
