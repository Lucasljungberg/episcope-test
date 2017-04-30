var NavbarView = function(container, model) {
    var self = this;
    this.container = container;
    this.user = model.getUser();
    this.menu = model.getMenu();
    this.navbarContent = container.find("#navbarContent");
    this.singleLiTemplate = container.find("#li-single-template").clone();
    this.dropdownLiTemplate = container.find("#li-dropdown-template").clone();

    this.loginForm = container.find("#navbar-login-form");
    this.logoutForm = container.find("#navbar-logout-form");
    this.logoutButton = this.logoutForm.find("#navbar-logout");

    // model.login(localStorage.user, null);
    model.fetchMenu();
}
