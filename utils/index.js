import * as d3 from "d3";

function getRanges(params) {
    let levelOrderMinMax = {};
    params.api.forEachNodeAfterFilterAndSort((node) => {
        let data = node.data;
        if (typeof data === "undefined") {
            data = node.aggData;
        }
        if (!levelOrderMinMax[node.level]) {
            levelOrderMinMax[node.level] = {
                min: data.price,
                max: data.price,
            };
        } else {
            levelOrderMinMax[node.level].min = Math.min(levelOrderMinMax[node.level].min, data.price);
            levelOrderMinMax[node.level].max = Math.max(levelOrderMinMax[node.level].max, data.price);
        }
    });
    return levelOrderMinMax;
}

function getRunningSum(params, config) {
    // get the running sum and store in array for each level
    let valueColumns = config?.valueColumns ? config.valueColumns : params.columnApi.getValueColumns().map((col) => col.getColId());
    let runningSum = {};
    params.api.forEachNodeAfterFilterAndSort((node) => {
        let data = node.data;
        const lvl = node.level;
        if (typeof data === "undefined") {
            data = node.aggData;
        }
        valueColumns.forEach((valueColumn) => {
            if (typeof runningSum[lvl] === "undefined") {
                runningSum[lvl] = {};
            }
            if (typeof runningSum[lvl][valueColumn] === "undefined") {
                runningSum[lvl][valueColumn] = {
                    sum: [data[valueColumn]],
                    max: data[valueColumn],
                    min: data[valueColumn]
                };
            } else {
                let target = runningSum[lvl][valueColumn];
                target.sum.push(target.sum[target.sum.length - 1] + data[valueColumn]);
                target.max = Math.max(...target.sum);
                target.min = Math.min(...target.sum);
            }
        });

    });
    return runningSum;
}

function waterfallHelper(
    {
        domains,
        range,
        scale,
        positiveColor,
        negativeColor,
        runningSum,
        columnWidth,
        value
    }
) {
    let offset = 0;
    let chartWidth = scale === "log" ? d3.scaleLog() : d3.scaleLinear();
    chartWidth.domain(domains);
    chartWidth.range(range);
    let width = chartWidth(value);
    if (typeof runningSum === "number") {
        offset = chartWidth(runningSum);
    }
    if (value < 0) {
        offset = offset - Math.abs(width);
    }
    const chartDiv = d3.create("div");
    const svg = chartDiv.append("svg")
        .attr("width", columnWidth)
        .attr("height", 40);
    const chart = svg.append("rect")
        .attr("x", offset)
        .attr("y", (30 - 30) / 2)
        .attr("width", Math.abs(width))
        .attr("height", 40)
        .attr("fill", value > 0 ? positiveColor : negativeColor);

    return chartDiv.node();
}
export { getRunningSum, waterfallHelper}