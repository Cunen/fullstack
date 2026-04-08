import { createComponent, EventName } from "@lit/react";
import React from "react";
import { WebButton } from "./button";
import { CMouseEvent } from "./events/events";

/** Button Component for React */
export const Button = createComponent({
  tagName: "c-button",
  elementClass: WebButton,
  react: React,
  events: {
    click: 'onclick' as EventName<CMouseEvent>,
  },
});
