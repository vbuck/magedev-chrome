var MageDevEnvironment = {

    _assets         : {},
    _el             : null,
    _icon           : null,
    _tagHtmlId      : 'MageDevEnvironmentTag',
    _tagClassName   : 'MageDevEnvironmentTag',
    _type           : '',
    _uri            : '',

    getResourceUri: function(path) {
        return this._uri + path;
    },

    getResourceDataUri: function(path) {
        if (path in this._assets) {
            return this._assets[path].dataUrl;
        }

        return '';
    },

    initialize: function(type, resourceUri, encodedAssets) {
        this._uri       = resourceUri || '';
        this._type      = type || '';
        this._assets    = encodedAssets || {};

        this.insertCue();
        this.setFavicon();
    },

    insertCue: function(type) {
        type = type || this._type;

        var existing = document.getElementById(this._tagHtmlId);

        if (existing) {
            existing.parentNode.removeChild(existing);
        }

        var element = document.createElement('div');

        element.id              = this._tagHtmlId;
        element.className       = this._tagClassName + ' ' + type;
        element.innerHTML       = 'env: ' + type;

        this._el = element;

        document.body.appendChild(element);
    },

    destroy: function() {
        if (this._el) {
            this._el.parentNode.removeChild(this._el);
            this._icon.parentNode.removeChild(this._icon);
        }
    },

    setFavicon: function(type) {
        type    = type || this._type;
        element = this._icon || document.createElement('link');

        element.rel     = 'icon';
        element.type    = 'image/png';
        element.href    = this.getResourceDataUri('assets/icon-' + type + '.png');

        if (!this._icon) {
            this._icon = element;
            document.getElementsByTagName('head')[0].appendChild(element);
        }
    }

};