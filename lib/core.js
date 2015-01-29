var MageDev = {

    initialize: function() {
        
    },

    newFromTemplate: function(type) {
        var collection  = this.select('[data-template="' + type + '"'),
            clone       = document.createElement('div');

        if (collection.length) {
            clone = collection[0].cloneNode(true);
            clone.removeAttribute('data-template');
        }

        return clone;
    },

    notify: function(message, title, callback) {
        title       = title || '';
        callback    = callback || function() {};

        if (message) {
            chrome.notifications.create(
                '',
                {
                    type        : 'basic',
                    iconUrl     : '/assets/icon-notification.png',
                    'title'     : title,
                    'message'   : message
                },
                callback
            );
        }
    },

    select: function(selector, single, context) {
        if (!context) {
            context = document;
        }

        var collection = Array.prototype.slice.call(context.querySelectorAll(selector));

        if (single) {
            return collection[0];
        }

        return collection;
    }

};

window.addEventListener('load', function() {
    MageDev.initialize();
});