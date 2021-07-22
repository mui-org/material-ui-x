---
title: Data Grid - Events
---

# Data Grid - Events [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

<p class="description">The data grid emits events that can be subscribed to attach custom behavior.</p>

## Subscribing to events

You can subscribe to one of the [events emitted](/components/data-grid/events/#catalog-of-events) by calling `apiRef.current.subscribeEvent()` with the name of the event and a handler. The handler will be called with two arguments: an object with information related to the event and a `MuiEvent` containing the DOM event or the React synthetic event, when available.

```tsx
/**
 * Allows to register a handler for an event.
 * @param event The name of event
 * @param handler The handler to be called
 * @param options Additional options for this listener
 * @returns A function to unsubscribe from this event
 */
subscribeEvent: (
  event: string,
  handler: (params: any, event: MuiEvent) => void,
  options?: GridSubscribeEventOptions,
) => () => void;
```

The following demo shows how to subscribe to the `columnResize` event. Try it by resizing the columns.

{{"demo": "pages/components/data-grid/events/SubscribeToEvents.js", "bg": "inline"}}

## Disabling the default behavior

Depending on the use case, it might be necessary to disable the default action taken by an event.
The `MuiEvent` passed to the event handler has a `defaultMuiPrevented` property to control when the default behavior can be executed or not.
Set it to `true` to block the default handling of an event and implement your own.

```tsx
<DataGrid
  onCellClick={(params: GridCellParams, event: MuiEvent) => {
    event.defaultMuiPrevented = true;
  }}
/>
```

Usually, double clicking a cell will put it into [edit mode](/components/data-grid/editing).
The following example changes this behavior by also requiring <kbd class="key">CTRL</kbd> to be pressed.

{{"demo": "pages/components/data-grid/events/DoubleClickWithCtrlToEdit.js", "bg": "inline"}}

## Catalog of events

{{"demo": "pages/components/data-grid/events/CatalogOfEventsNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [XGrid](/api/data-grid/x-grid/)
