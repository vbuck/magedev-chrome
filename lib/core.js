var MageDev = {

    extend: function() {
        var extended = {};

        var merge = function (object) {
            for (var key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    if ( Object.prototype.toString.call(object[key]) === '[object Object]' ) {
                        extended[key] = MageDev.extend(extended[key], object[key]);
                    } else {
                        extended[key] = object[key];
                    }
                }
            }
        };

        merge(arguments[0]);

        for (var i = 1; i < arguments.length; i++) {
            var object = arguments[i];

            merge(object);
        }

        return extended;
    },

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