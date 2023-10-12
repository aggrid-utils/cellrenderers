# A collection of cellrenderers for Aggrid

#How to install:

```
npm install cellrenderers
```

## Cellrenderers

##### 1. Waterfall - A cellrenderer that displays a waterfall chart:

This will show one value column of the grid as waterfall chart

Usage:

1. In your gridOptions file add the following:

```javascript
import { WaterfallCellRenderer } from "cellrenderers";
import { setupRenderers } from "cellerenderers/shortcuts";
const gridOptions = {
  context: {},
  onGridReady: function (params) {
    setupRenderers(gridOptions, params);
  },
};
```

2. Now update your columnDefs to use the WaterfallCellRenderer:

```javascript
const columnDefs = [
  { field: "make", rowGroup: true },
  { field: "model" },
  {
    field: "price",
    cellRenderer: WaterfallCellRenderer,
    aggFunc: "sum",
    width: "200px",
  },
];
```
