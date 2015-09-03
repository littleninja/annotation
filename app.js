define([
    './template',
    './samples/theNose'
], function (Template, config) {

    var Annotation = {

        init: function (config) {
            this._container = document.getElementById('container');
            this._container.innerHTML = Template.addBlock(config.annotation.contents);
            this._annotations = this._getAnnotations(Template.count);
            this._addEventListeners();
        },

        restart: function () {},

        destroy: function () {},

        _getAnnotations: function (count) {
            var antns = [],
                antn = [];
            for (var i = 0, n = count; i < n; ++i){
                antn = this._container.querySelector('[data-antn-type="inline"][data-antn-index="'+i+'"]');
                antn.push(this._container.querySelector('[data-antn-type="callout"][data-antn-index="'+i+'"]'));
                antns.push(antn);
            }
            return antns;
        },

        _addEventListeners: function () {
        }

    };

    window.Annotation = Annotation;

    window.onload = Annotation.init(config);

    return Annotation;

});