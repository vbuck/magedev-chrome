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
    function(details) {
        var settings = {
            tab_icons   : MageDevEnvironments.tab_icons,
            page_tags   : MageDevEnvironments.page_tags,
            tag_layout  : MageDevEnvironments.tag_layout
        };

        for (var id in MageDevEnvironments.environments) {
            var environment = MageDevEnvironments.environments[id];

            if (isEnvironment(details, environment)) {
                updateTab(details.tabId, environment, settings);
            } else {
                updateTab(details.tabId, false);
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

function isEnvironment(details, environment) {
    console.log(details.url, environment.url);
    if (details.url.match(new RegExp(environment.url))) {
        return true;
    }

    return false;
};

function resetAssetStates() {
    MageDevAssetLoadStates  = {
        callbacks   : [],
        assets      : {}
    };
};

function updateTab(tabId, environment, settings) {
    settings = settings || {};

    if (environment === false) {
        if (tabId in MageDevTabStates) {
            chrome.tabs.executeScript(
                tabId, 
                {
                    code: 'if ("MageDevEnvironment" in window) MageDevEnvironment.destroy();'
                },
                function() {}
            );
        }
    } else {
        chrome.tabs.insertCSS(
            tabId,
            {
                file: 'assets/inject.css'
            }
        );

        chrome.tabs.executeScript(
            tabId,
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
                        settings.assets = encodedAssets;

                        chrome.tabs.executeScript(
                            tabId,
                            {
                                code: 'MageDevEnvironment.initialize("' + 
                                    environment.type + '", "' + 
                                    chrome.extension.getURL('') + '", ' + 
                                    JSON.stringify(settings) + 
                                ');'
                            },
                            function() {
                                MageDevTabStates[tabId] = environment;

                                resetAssetStates();
                            }
                        );
                    }
                );
            }
        );
    }
}