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

function getRunningSum(params) {
    // get the running sum and store in array for each level
    let runningSum = {};
    params.api.forEachNodeAfterFilterAndSort((node) => {
        let data = node.data;
        const lvl = node.level;
        if (typeof data === "undefined") {
            data = node.aggData;
        }
        if (typeof runningSum[lvl] === "undefined") {
            runningSum[lvl] = {
                sum: [data.price],
                max: [data.price],
                min: [data.price]
            };
        } else {
            runningSum[lvl].sum.push(runningSum[lvl].sum[runningSum[lvl].sum.length - 1] + data.price);
            runningSum[lvl].max = Math.max(...runningSum[lvl].sum);
            runningSum[lvl].min = Math.min(...runningSum[lvl].sum);
        }
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
    // if (typeof runningSum === "undefined") return;
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
    // console.log(`domains: ${domains}, range: ${range}, runningSum: ${runningSum}, width: ${width}, value: ${value} offset: ${offset}`);
    const chart = svg.append("rect")
        .attr("x", offset)
        .attr("y", (30 - 30) / 2)
        .attr("width", Math.abs(width))
        .attr("height", 40)
        .attr("fill", value > 0 ? positiveColor: negativeColor);

    return chartDiv.node();
}
module.exports = {
    getRanges: getRanges,
    getRunningSum: getRunningSum,
    waterfallHelper: waterfallHelper
}