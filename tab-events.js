var MageDevEnvironments     = {},
    MageDevTabStates        = {},
    MageDevAssetLoadStates  = {
        callbacks   : [],
        assets      : {}
    };

chrome.storage.sync.get('MageDevOptionEnvironments', function(data) {
    MageDevEnvironments = data.MageDevOptionEnvironments;
});

chrome.webNavigation.onDOMContentLoaded.addListener(
    function(tab) {
        for (var id in MageDevEnvironments) {
            var environment = MageDevEnvironments[id];

            if (isEnvironment(tab, environment)) {
                updateTab(tab, environment);
            } else {
                updateTab(tab, false);
            }
        }
    }
);

function encodeAssets(assets, callback) {
    var encodedAssets   = [],
        image           = null;

    MageDevAssetLoadStates.callbacks.push(callback || function() {});

    for (var i = 0; i < assets.length; i++) {
        var id  = assets[i],
            url = chrome.extension.getURL(assets[i]);

        image = new Image();

        MageDevAssetLoadStates.assets[id] = {
            readyState  : false,
            source      : image,
            assetUrl    : url,
            dataUrl     : ''
        };

        image.crossOrigin = 'Anonymous';

        image.onload = encodeAssetsCheckState.bind(null, id, true);

        image.src = url;
    }
};

function encodeAssetsCheckState(id, state) {
    MageDevAssetLoadStates.assets[id].readyState = state;

    if (state === true) {
        var canvas  = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            image   = MageDevAssetLoadStates.assets[id].source;

        canvas.width    = image.width;
        canvas.height   = image.height;

        context.drawImage(image, 0, 0);

        MageDevAssetLoadStates.assets[id].dataUrl    = canvas.toDataURL('image/png');
        MageDevAssetLoadStates.assets[id].source     = null;
        canvas                                       = null;
    }

    for (var id in MageDevAssetLoadStates.assets) {
        if (!MageDevAssetLoadStates.assets[id].readyState) {
            return false;
        }
    }

    for (var i = 0; i < MageDevAssetLoadStates.callbacks.length; i++) {
        MageDevAssetLoadStates.callbacks[i].call(null, MageDevAssetLoadStates.assets);
    }
};

function isEnvironment(tab, environment) {
    if (tab.url.match(new RegExp(environment.url))) {
        return true;
    }

    return false;
};

function updateTab(tab, environment) {
    if (environment === false) {
        if (tab.id in MageDevTabStates) {
            chrome.tabs.executeScript(
                tab.id, 
                {
                    code: 'if ("MageDevEnvironment" in window) MageDevEnvironment.destroy();'
                },
                function() {}
            );
        }
    } else {
        chrome.tabs.insertCSS(
            tab.id,
            {
                file: 'assets/inject.css'
            }
        );

        chrome.tabs.executeScript(
            tab.id,
            {
                file: 'lib/inject.js'
            },
            function() {
                encodeAssets(
                    [
                        'assets/icon-development.png',
                        'assets/icon-staging.png',
                        'assets/icon-production.png',
                    ],
                    function(encodedAssets) {
                        chrome.tabs.executeScript(
                            tab.id,
                            {
                                code: 'MageDevEnvironment.initialize("' + environment.type + '", "' + chrome.extension.getURL('') + '", ' + JSON.stringify(encodedAssets) + ');'
                            },
                            function() {
                                MageDevTabStates[tab.id] = environment;
                            }
                        );
                    }
                );
            }
        );
    }
}