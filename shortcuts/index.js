import { getRunningSum } from "../utils";
function setupRenderers(gridOptions, params) {
    gridOptions.context = {
        runningSum: getRunningSum(params),
    };
    params.api.redrawRows();
    params.api.refreshHeader();
}

module.exports = {
    setupRenderers: setupRenderers
};