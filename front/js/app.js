$(document).ready(function() {
    var root = $("#app");

    /*
     * Could/should be switched out for a pre-build Service
     */
    if (localStorage.user && localStorage.rem_token) {
        var data = {
            username: localStorage.user,
            rem_token: localStorage.rem_token
        };
        $.post("/token_auth", data).then(function(res) {
            localStorage.setItem("rem_token", res.rem_token);
        }).catch(function(err) {
            console.error(err);
        }).then(function() { // Finally/Always
            initializeApp();
        });
    } else {
        initializeApp();
    }

    function initializeApp() {
        // Creates a model to manage the data
        var model = new AppModel();

        // Sets up initial view settings and variables
        var navbarView = new NavbarView(root.find("#mainNavbar"), model);
        var searchSettingsView = new SearchSettingsView(root.find("#settingsContainer"), model);

        // Sets up events and observers for navbarView
        var navbarViewController = new NavbarViewController(model, navbarView);    
        var searchSettingsController = new SearchSettingsController(model, searchSettingsView);
    }
    
});
