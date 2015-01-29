MageDev.Options = {

    _bindEvents: function() {
        MageDev
            .select('[data-trigger*="Options."]')
            .forEach(
                function(element) {
                    if ( !(element instanceof HTMLElement) ) {
                        return;
                    }

                    var method = element.getAttribute('data-trigger').substring(8);

                    if (method in MageDev.Options) {
                        element.addEventListener('click', MageDev.Options[method].bind(MageDev.Options));
                    }
                }
            );
    },

    addEnvironment: function(data) {
        data = data || {};

        var table   = MageDev.select('#environment_table', true),
            newRow  = MageDev.newFromTemplate('environment-row'),
            fields  = MageDev.select('[data-can-clone]', false, newRow),
            field   = null,
            id      = data.id ? data.id : (new Date()).getTime().toString();

        for (var i = 0; i < fields.length; i++) {
            field = fields[i];

            field.id = field.id.replace(/%ID%/, id);

            var idParts = field.id.split('_'),
                dataKey = idParts.pop();

            if (dataKey in data) {
                field.value = data[dataKey];
            }

            field.removeAttribute('data-can-clone');
        }

        newRow.setAttribute('data-type', 'environment-row');
        newRow.setAttribute('data-id', id);

        table.tBodies[0].appendChild(newRow);
    },

    initialize: function() {
        this._bindEvents();

        this.loadEnvironments();
    },

    loadEnvironments: function() {
        chrome.storage.sync.get('MageDevOptionEnvironments', function(data) {
            var environments = data.MageDevOptionEnvironments;

            for (var id in environments) {
                MageDev.Options.addEnvironment(environments[id]);
            }
        });
    },

    removeSelectedEnvironments: function() {
        MageDev
            .select('[data-toggle="environment-select"]')
            .forEach(
                function(element) {
                    if (element.getAttribute('data-can-clone') == '') {
                        return;
                    }

                    if (element.checked) {
                        var idParts = element.id.split('_'),
                            row     = MageDev.select('[data-id="' + idParts[1] + '"]', true);
                        row.parentNode.removeChild(row);
                    }
                }
            );
    },

    saveChanges: function() {
        var data = { MageDevOptionEnvironments: {} };

        try {
            MageDev
                .select('[data-type="environment-row"]')
                .forEach(
                    function(row) {
                        var rowData = {
                            id: row.getAttribute('data-id')
                        };

                        MageDev
                            .select('input, select, textarea', null, row)
                            .forEach(
                                function(element) {
                                    var idParts = element.id.split('_');

                                    rowData[idParts.pop()] = element.value;
                                }
                            );

                        data.MageDevOptionEnvironments[rowData.id] = rowData;
                    }
                );

            chrome.storage.sync.set(
                data,
                function() {
                    MageDev.notify('Settings changed successfully.');
                }
            );
        } catch (error) {
            console.log(error, data);

            MageDev.notify('Failed to save changes.');
        }
    },

    toggleSelectedEnvironments: function(event) {
        var source = event.target;

        setTimeout(
            function() {
                MageDev
                    .select('[data-toggle="environment-select"]')
                    .forEach(
                        function(element) {
                            element.checked = source.checked;
                        }
                    );
            },
            25
        )
    }

};

window.addEventListener('load', function() {
    MageDev.Options.initialize();
});