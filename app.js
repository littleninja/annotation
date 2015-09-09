define([
    './template',
    './samples/theNose',
    './samples/theMetamorphosis' //theMetamorphosis
], function (Template, theNoseCfg, theMetaCfg) {

    var Annotation = {

        init: function (config) {

            this._id = config.annotation.id;
            this._eventListeners = [];

            this._container = document.getElementById('container');
            this._container.insertAdjacentHTML('beforeEnd', Template.addBlock(config.annotation.contents));
            this._annotation = this._container.querySelector('[data-antn-type="annotation"]');
            this._inlineElems = this._container.querySelectorAll('[data-antn-type="inline"]');
            this._calloutElems = this._container.querySelectorAll('[data-antn-type="callout"]');
            this._addInlineListeners();
            this._addSequenceListeners();
            this._addStorageListeners();
            this._addStorageResponses();
        },

        restart: function () {
            this.destroy();
            this.init(config)
        },

        destroy: function () {

            this._eventListeners.forEach(function (e) {
                e.element.removeEventListener(e.type, e.handler);
            });
            this._eventListeners = null;

            this._annotation.innerHTML = '';
            this._annotation.parentNode.removeChild(this._annotation);
            this._annotation = null;
        },

        _addStorageResponses: function () {
            var calloutElems = this._calloutElems,
                responseElem,
                responseStored;

            for (var i = 0, n = calloutElems.length; i < n; ++i) {
                responseElem = calloutElems[i].querySelector('[data-antn-type="input"]');
                responseStored = localStorage.getItem(this._id + '-' + i) || '';
                if (responseElem && responseStored) {
                    responseElem.value = responseStored;
                }
            }
        },

        _addStorageListeners: function () {
            var calloutElems = this._calloutElems,
                onResponseInputHandler;

            function onResponseInput (id, e) {
                var key = id + '-' + e.target.getAttribute('data-antn-index'),
                    value = e.target.value;
                localStorage.setItem(key, value);
            }

            onResponseInputHandler  = onResponseInput.bind(this, this._id);

            for (var i = 0, n = calloutElems.length; i < n; ++i) {
                this._addEventListener(calloutElems[i].querySelector('[data-antn-type="input"]'), 'input', onResponseInputHandler);
            }
        },

        _addSequenceListeners: function () {
            var inlineElems = this._inlineElems,
                onInlineClickHandler;

            function onClickNext (inlineElems, e) {

                var inline, index, next;

                // Because Google Translate adds markup during translation,
                // walking up the DOM until we find our element.
                inline = e.target;
                while (!inline.hasAttribute('data-antn-type')) {
                    inline = inline.parentNode;
                }

                // only act if the user clicked the current question
                if (inline.hasAttribute('data-antn-next')) {
                    index = inline.getAttribute('data-antn-index');
                    next = inlineElems[+index + 1];

                    inline.removeAttribute('data-antn-next');
                    if (next) {
                        next.setAttribute('data-antn-next', '');
                    }
                }
            }

            onInlineClickHandler = onClickNext.bind(this, inlineElems);

            for (var i = 0, n = inlineElems.length; i < n; ++i) {
                this._addEventListener(inlineElems[i], 'click', onInlineClickHandler);
            }

            inlineElems[0].setAttribute('data-antn-next', '');
        },

        _addInlineListeners: function () {
            var inlineElems = this._inlineElems,
                onInlineClickHandler;

            function onInlineClick (calloutElems, e) {

                var inline, index, callout, isSelected;

                // Because Google Translate adds markup during translation,
                // walking up the DOM until we find our element.
                inline = e.target;
                while (!inline.hasAttribute('data-antn-type')) {
                    inline = inline.parentNode;
                }

                index = inline.getAttribute('data-antn-index');
                callout = calloutElems[index];
                isSelected = callout.getAttribute('data-antn-selected') === 'selected';


                // unselect all
                for (var i = 0; i < calloutElems.length; ++i) {
                    calloutElems[i].setAttribute('data-antn-selected', '');
                }

                // toggle matching question
                if (callout && !isSelected) {
                    callout.setAttribute('data-antn-selected', 'selected');
                }
            }

            onInlineClickHandler = onInlineClick.bind(this, this._calloutElems);

            for (var i = 0, n = inlineElems.length; i < n; ++i) {
                this._addEventListener(inlineElems[i], 'click', onInlineClickHandler);
            }
        },

        _addEventListener: function (elem, type, handler, bubbles) {
            elem.addEventListener(type, handler, !!bubbles);
            this._eventListeners.push({
                type: type,
                element: elem,
                handler: handler
            });
        }

    };


    window.Annotation = Annotation;
    window.onload = function () {
        Annotation.init(theNoseCfg);
    };

    //this can be done better
    document.getElementById('nose').onclick = function(){
        Annotation.destroy();
        Annotation.init(theNoseCfg);
    };

    document.getElementById('meta').onclick = function(){
        Annotation.destroy();
        Annotation.init(theMetaCfg);
    };

    return Annotation;

});