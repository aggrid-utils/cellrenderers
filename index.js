import { waterfallHelper } from "./utils/index.js";
function basicCellrenderer(params) {
    console.log(JSON.stringify(params.context.levelOrderMinMax));
    return params.value;
}

function WaterfallCellRenderer(
    params,
    config
) {
    if(params.node.level === -1) return params.value;
    let dataSource = config?.dataSource? config.dataSource : params.context.runningSum;
    let nodeId = params.node.id.split("-");
    let rowNumber = Number(nodeId[nodeId.length - 1]);
    let columnWidth = params.column.actualWidth;
    const valueKey = config?.valueKey || "value";
    let positiveColor = config?.positiveColor || "green";
    let negativeColor = config?.negativeColor || "red";

    let runningSum = null;
    let min = 0;
    let max = 0;
    try {
        let runningObj = dataSource[params.node.level][params.column.colId];
        min = runningObj.min;
        max = runningObj.max;
        runningSum = runningObj.sum[rowNumber - 1];
    } catch (error) {
        console.warn("An error occurred: ", error);
        console.log(dataSource, params.node.level);
    }
    let domain = [0, max];
    if (config?.axisType === "atomic") {
        let maxValue = Math.max(Math.abs(min), Math.abs(max));
        domain[0] = min < 0 ? -maxValue : maxValue;
        domain[1] = max > 0 ? maxValue : -maxValue;
    }
    let range = [0, columnWidth];
    if (min < 0 && max < 0) {
        range = [-100, 0];
    } else if (min < 0 && max > 0) {
        range = [-50, 50];
    } else if (min > 0 && max > 0) {
        range = [0, columnWidth];
    }
        
    return waterfallHelper({
        domains: domain,
        range: range,
        scale: config?.scale || "linear",
        positiveColor: positiveColor,
        negativeColor: negativeColor,
        runningSum: runningSum,
        columnWidth: columnWidth,
        value: params[valueKey]
    });
}

export { WaterfallCellRenderer};