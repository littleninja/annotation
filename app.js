define([
    './template',
    './samples/theNose'
], function (Template, config) {

    var Annotation = {

        init: function (config) {
            this._container = document.getElementById('container');
            this._container.insertAdjacentHTML('beforeEnd', Template.addBlock(config.annotation.contents));
        },

        start: function () {
            this._inlineElems = this._getInlineElements(Template.count);
            this._calloutElems = this._getCalloutElements(Template.count);
            this._eventListeners = [];
            this._addEventListeners();
            this._addSequenceListeners();
        },

        restart: function () {},

        destroy: function () {},

        _getInlineElements: function () {
            return this._container.querySelectorAll('[data-antn-type="inline"]');
        },

        _getCalloutElements: function () {
            return this._container.querySelectorAll('[data-antn-type="callout"]');
        },

        _addSequenceListeners: function () {
            var inlineElems = this._inlineElems;

            function onClickNext (inlineElems, e) {
                var index = e.target.getAttribute('data-antn-index');
                var inline = e.target;
                var next = inlineElems[+index + 1];

                inline.removeAttribute('data-antn-next');

                if (next) {
                    next.setAttribute('data-antn-next', '');
                }
            }

            var onInlineClickHandler = onClickNext.bind(this, inlineElems);

            for (var i = 0, n = inlineElems.length; i < n; ++i) {
                inlineElems[i].addEventListener('click', onInlineClickHandler);
                this._eventListeners.push({
                    type: 'click',
                    element: inlineElems[i],
                    handler: onInlineClickHandler
                });
            }

            inlineElems[0].setAttribute('data-antn-next', '');
        },

        _addEventListeners: function () {
            var inlineElems = this._inlineElems;

            function onInlineClick (calloutElems, e) {
                var index = e.target.getAttribute('data-antn-index');
                var callout = calloutElems[index];
                var isSelected = callout.getAttribute('data-antn-selected') === 'selected';
                for (var i = 0; i < calloutElems.length; ++i) {
                    calloutElems[i].setAttribute('data-antn-selected', '');
                }
                if (callout && !isSelected) {
                    callout.setAttribute('data-antn-selected', 'selected');
                }
            }

            var onInlineClickHandler = onInlineClick.bind(this, this._calloutElems);

            for (var i = 0, n = inlineElems.length; i < n; ++i) {
                inlineElems[i].addEventListener('click', onInlineClickHandler);
                this._eventListeners.push({
                    type: 'click',
                    element: inlineElems[i],
                    handler: onInlineClickHandler
                });
            }
        }

    };

    window.Annotation = Annotation;

    window.onload = function () {
        Annotation.init(config);
        Annotation.start();
    };

    return Annotation;

});