import { getRunningSum } from "../utils";
function setupRenderers(gridOptions, params, config) {
    gridOptions.context = {
        runningSum: getRunningSum(params),
    };
    if (!config?.noRefresh) {
        params.api.redrawRows();
        params.api.refreshHeader();
    }

}

export {setupRenderers};