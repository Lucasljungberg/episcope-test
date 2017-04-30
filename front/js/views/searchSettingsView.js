var SearchSettingsView = function(container, model) {
    this.container = container;
    this.radioOptions = container.find("#radioOptions");
    this.overviewOption = this.radioOptions.find("#overviewOption");

    this.buttonOptions = container.find("#btnOptions");
    this.overview = true;

    this.buttonOptions.hide();
}
