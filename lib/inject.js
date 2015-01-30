var MageDevEnvironment = {

    _el             : null,
    _icon           : null,
    _settings       : {
        assets      : {},
        tab_icons   : true,
        page_tags   : true,
        tag_layout  : 'default'
    },
    _tagHtmlId      : 'MageDevEnvironmentTag',
    _tagClassName   : 'MageDevEnvironmentTag',
    _type           : '',
    _uri            : '',

    getResourceUri: function(path) {
        return this._uri + path;
    },

    getResourceDataUri: function(path) {
        if (path in this._settings.assets) {
            return this._settings.assets[path].dataUrl;
        }

        return '';
    },

    initialize: function(type, resourceUri, settings) {
        this._uri       = resourceUri || '';
        this._type      = type || '';
        this._settings  = settings || {};

        this.insertCue();
        this.setFavicon();
    },

    insertCue: function(type) {
        if (!this._settings.page_tags) {
            return;
        }

        type = type || this._type;

        var existing = document.getElementById(this._tagHtmlId);

        if (existing) {
            existing.parentNode.removeChild(existing);
        }

        var element = document.createElement('div');

        element.id              = this._tagHtmlId;
        element.className       = this._tagClassName + ' ' + type + ' layout-' + this._settings.tag_layout;
        element.innerHTML       = 'env: ' + type;

        this._el = element;

        document.body.appendChild(element);
    },

    destroy: function() {
        if (this._el) {
            this._el.parentNode.removeChild(this._el);
        }
        
        if (this._icon) {
            this._icon.parentNode.removeChild(this._icon);
        }
    },

    setFavicon: function(type) {
        if (!this._settings.tab_icons) {
            return;
        }

        type    = type || this._type;
        element = this._icon || document.createElement('link');

        var existing = document.getElementById(this._tagHtmlId + '_favicon');

        if (existing) {
            existing.parentNode.removeChild(existing);
        }

        element.rel     = 'icon';
        element.id      = this._tagHtmlId + '_favicon';
        element.type    = 'image/png';
        element.href    = this.getResourceDataUri('assets/icon-' + type + '.png');

        if (!this._icon) {
            this._icon = element;
            document.getElementsByTagName('head')[0].appendChild(element);
        }
    }

};