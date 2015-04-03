modules = {"modules":[]};

// Example config (this is pretty much unreadable/unusable), but it does show each configuration
modules.config =
    [
        {"name":"weatherIframe"},
        {"name": "C2x1", "arguments":[{"name":"weatherIframe"}, {"name":"shoppingList"}]},
        {"name": "C1x2", "arguments":[{"name":"shoppingList"}, {"name":"weatherIframe"}]},
        {"name":"C2x2", "arguments":[
            {"name":"weatherIframe"},
            {"name": "C2x1", "arguments":[{"name":"weatherIframe"}, {"name":"shoppingList"}]},
            {"name": "C1x2", "arguments":[{"name":"shoppingList"}, {"name":"weatherIframe"}]},
            {"name":"weatherIframe"}
        ]}
    ];


// Combinators will be preceeded with a capitol C
/*
    name: objectName
    arguments: Array of arguments
 */

modules.C2x2 = function(parent, config) {
    var elements = [];
    elements.push(document.createElement('DIV'));
    elements[0].setAttribute('class', 'C2x2 module');
    parent.appendChild(elements[0]);

    elements.push(document.createElement('DIV'));
    elements[1].setAttribute('class', 'C2x2 module');
    parent.appendChild(elements[1]);

    elements.push(document.createElement('DIV'));
    elements[2].setAttribute('class', 'C2x2 module');
    parent.appendChild(elements[2]);

    elements.push(document.createElement('DIV'));
    elements[3].setAttribute('class', 'C2x2 module');
    parent.appendChild(elements[3]);

    this.modules = modules.init(elements, config);
};

modules.C2x1 = function(parent, config) {
    var elements = [];
    elements.push(document.createElement('DIV'));
    elements[0].setAttribute('class', 'C2x1 module');
    parent.appendChild(elements[0]);

    elements.push(document.createElement('DIV'));
    elements[1].setAttribute('class', 'C2x1 module');
    parent.appendChild(elements[1]);

    this.modules = modules.init(elements, config);
};

modules.C1x2 = function(parent, config) {
    var elements = [];
    elements.push(document.createElement('DIV'));
    elements[0].setAttribute('class', 'C1x2 module');
    parent.appendChild(elements[0]);

    elements.push(document.createElement('DIV'));
    elements[1].setAttribute('class', 'C1x2 module');
    parent.appendChild(elements[1]);

    this.modules = modules.init(elements, config);
};

// Initialize modules in the given elements based on the config
modules.init = function(elements, config) {
    var mods = [];
    for (var i=0; i<config.length; i++) {
        if (typeof elements === 'undefined') {
            throw "Config elements length mismatch";
        }
        // Loads module with required arguments (if any)
        if (config[i].hasOwnProperty('arguments')) {
            mods.push(new modules[config[i].name](elements[i], config[i].arguments));
        }
        else {
            mods.push(new modules[config[i].name](elements[i]));
        }
    }

    return mods;
};

// Basic IFrame based weather module
modules.weatherIframe = function(element) {
    this.element = element;
    this.load = function() {
        var frame = document.createElement('IFRAME');
        frame.setAttribute('class', 'parent-size');
        frame.setAttribute('src', 'http://www.weather.com/weather/today/l/USMA0046:1:US');
        this.element.appendChild(frame);
    };
    this.load();
};

// Simple (static) shopping list module - displays constant shopping list
modules.shoppingList = function(element) {
    element.innerHTML = "<ul><li>Coffee</li><li>Heroin</li><li>Meth</li><li>Booze</li><li>Drugs</li></ul>";
}

// Loads initial config into DOM
modules.load = function() {
    // Does not use className selector because elements with module class are being added
    modules.modules = modules.init(document.querySelectorAll('.module-row .module'), modules.config);
};

// This is a little Post request macro/library that should help with AJAX
// and stop me from having to look up the requestHeader whenever I need a POST request
function Post(url, async) {
    if(typeof async == 'undefined') {
        async = true;
    }
    this.request = new XMLHttpRequest();
    this.request.open('POST', createPath(url), async);
    this.request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    this.callback = function() {return false};
    this.onStateChange = false;
    this.onCompletion = function(event) {
        var ajax = event.traget;
        if (ajax.readyState == 4 && ajax.status == 200) {
            this.callback(ajax.responseText);
        }
        else if (ajax.status != 200) {
            throw "AJAX Error: status is " + ajax.status + ".";
        }
    }
    this.send = function (data) {
        if (this.onStateChange != false) {
            this.request.onreadystatechange = this.onStateChange;
        }
        else {
            this.request.onreadystatechange = this.onCompletion;
        }
        if(typeof data != 'undefined') {
            this.data = data + login.encodeCookies();
        }
        else {
            this.data = login.encodeCookies(true);
        }
        this.request.send(this.data);
    }
}

function apiAccess(url, callback) {
    if (typeof callback === 'undefined') {
        callback = function() {return false};
    }
    var request = new Post(url, true);
    request.onStateChange
}

document.addEventListener('DOMContentLoaded', modules.load, false);