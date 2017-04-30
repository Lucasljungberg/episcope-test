var SearchSettingsController = function(model, view) {
    view.overviewOption.find("input[type=radio]").change(function(e) {
        if (this.value === "detail") {
            view.buttonOptions.show();
            view.overview = false;
        } else if (this.value === "overview") {
            view.buttonOptions.hide();
            view.overview = true;
        }
    });
}
