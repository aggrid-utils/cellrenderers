function basicCellerender(params) {
    return params.valueFormatted ? params.valueFormatted : params.value;
}

module.exports = {
    basicCellerender: basicCellerender
};