const eventConfig = { bubbles: false, composed: false };
const defineEventConfig = {
  bubbles: { value: eventConfig.bubbles },
  composed: { value: eventConfig.composed },
};

export class CMouseEvent extends MouseEvent {
  constructor(name: string, e?: MouseEvent) {
    if (e) Object.defineProperties(e, defineEventConfig);
    super(name, e);
  }
}

export const sendClickEvent = (node: Node, e?: MouseEvent) => {
  node.dispatchEvent(new CMouseEvent("onclick", e));
};
