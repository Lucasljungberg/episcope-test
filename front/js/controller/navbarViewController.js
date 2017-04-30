var NavbarViewController = function(model, view) {

    /*
     * Setup button click-events
     */
    
    view.loginForm.find("button").click(function(e) {
        if (model.loggedIn) return;
        var username = view.loginForm.find(".login-username").val();
        var pass = "12345";
        var remember = view.loginForm.find(".login-rem").is(":checked");
        model.login(username, pass, remember).then(function(res) {            
            view.loginForm.find("input").val("");
        });
    });

    view.logoutButton.click(function(e) {
        if (!model.loggedIn) return;
        model.logout();
    });

    /*
     * Observers
     */
    
    /**
     * Adds an observer for when the user logs in.
     */
    model.addObserver("login", function() {
        view.logoutButton.show();
        view.loginForm.hide();
        view.container.find("#navbar-login-name").text("You are logged in as: " + model.loggedInUser);
    });


    /**
     * Adds an observer for when the user logs out.
     */
    model.addObserver("logout", function() {
        view.loginForm.show();
        view.logoutButton.hide();
        view.container.find("#navbar-login-name").text("You are not logged in");
        view.navbarContent.empty();
        view.navbarContent.append(view.singleLiTemplate).append(view.dropdownLiTemplate);
    });

    /**
     * Private function to copy a template
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    function copyTemplate(element) {
        return element.clone().removeAttr("id").removeClass("template");
    }

    /**
     * Adds an observer for when the menu is updated and
     * updates the menu with new data.
     */
    model.addObserver("menuUpdated", function() {
        if (model.loggedIn) {
            view.loginForm.hide();
            view.logoutButton.show();
            view.container.find("#navbar-login-name").text("You are logged in as: " + model.loggedInUser);
        }
        var menu = model.getMenu();
        $.each(menu, function(key, item) {
            if (item.dropdown) {
                var li = copyTemplate(view.dropdownLiTemplate);
                item.options.forEach(function(item) {
                    var option = copyTemplate(view.singleLiTemplate);
                    option.find("a").text(item.name).attr("href", item.href);
                    li.find(".dropdown-menu").append(option);
                });
                li.find(".dropdown-item-name").text(item.name);
                view.navbarContent.append(li);
            } else {
                var li = copyTemplate(view.singleLiTemplate);
                li.find("a").text(item.name);
                view.navbarContent.append(li);
            }
        });
    });
}
