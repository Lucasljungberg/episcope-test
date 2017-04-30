var AppModel = function() {
    /*
     * Public Fields
     */
    this.loggedInUser = null;
    this.loggedIn = false;
    this.menu = [];

    /*
     * Private fields
     */
    var self = this;
    var observers = {};

    /**
     * Adds an observer-handler pair. 
     * Multiple handlers can be put under a single name. Assigning a handler with an already
     * existing name will not remove the previous one.
     * @param {[string]} name   Name of the handler
     * @param {[type]} handler  Callable to be used when observed object is changed.
     */
    this.addObserver = function(name, handler) {
        if (!observers.hasOwnProperty(name)) {
            observers[name] = [];
        }
        observers[name].push(handler);
    }

    /**
     * Notifies observers that an update has been made.
     * Will run all handlers with the given name
     * @param  {[string]} name Name of observer to be notified
     */
    function notifyObserver(name) {
        for (var obs in observers) {
            if (obs === name) {
                observers[obs].forEach(function(handler) {
                    handler();
                });
            }
        }
    }

    /**
     * Returns the name of the logged in user, if user is logged in
     * @return {[string]} Username of logged in user
     */
    this.getUser = function() {
        if (this.loggedIn) return false;
        return this.loggedInUser;
    }

    /**
     * Returns current navbar menu items
     * @return {[object]} Object representing navbar menu
     */
    this.getMenu = function() {
        return this.menu;
    }

    /**
     * Fetches menu data from the server.
     * Notifies the "menuUpdated" observers that the menu has been changed.
     * @return {[Promise]}  Returns a promise from the sent request
     */
    this.fetchMenu = function() {
        return $.get("/data").then(function(res) {
            self.menu = res.data;
            if (res.username) {
                self.loggedIn = true;
                self.loggedInUser = res.username;
            }
            notifyObserver("menuUpdated");
        }).catch(function(err) {
            console.error(err);
        });
    }

    /**
     * Logs in. 
     * Sends a post request to server.
     * Notifies "login" observers that the user has logged in.
     * Will also attempt to fetch new menu data.
     * @param  {[string]} user  User-entered username
     * @param  {[string]} pass  User-entered password
     * @return {[promise]}      Returns the promise returned when sent request.
     */
    this.login = function(user, pass, rem) {
        if (user === undefined) return;
        if (pass === undefined) return;
        var data = {
            username: user,
            pass: pass,
            remember: rem,
        };

        return $.post("/login", data).then(function(res) {
            console.log(res);
            self.loggedInUser = user;
            notifyObserver("login");
            self.fetchMenu();
            if (rem) {
                localStorage.setItem("user", user);
                localStorage.setItem("rem_token", res.rem_token);
            }
        }).catch(function(err) {
            alert("Error logging in");
            console.error(err);
            throw Error("asd");
        });
    }

    /**
     * Perform a logout. 
     * Will notify "logout" observers.
     * Resets fields
     * @return {[Promise]} Returns the promise returned by the request.
     */
    this.logout = function() {
        localStorage.removeItem("user");
        localStorage.removeItem("rem_token");
        return $.post("/logout").then(function(res) {
            self.loggedInUser = null;
            self.loggedIn = false;
            self.menu = [];
            notifyObserver("logout");
        }).catch(function(err) {
            alert("Error logging out");
            console.error(err);
        });
    }
}
