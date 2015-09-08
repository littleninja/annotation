define(function () {

    var _counter = 0;
    var _hasQuestions = false;

    function addBlock (contents) {
        _counter = 0;
        _hasQuestions = false;
        var headerBuilder = '',
            bodyBuilder = '';
        if (contents.header) {
            headerBuilder += addHeader(contents.header);
        }
        for (var i = 0, n = contents.body.length; i < n; ++i) {
            if (contents.body[i].hasOwnProperty('marker')){
                bodyBuilder += addMarker(contents.body[i].marker);
            } else {
                bodyBuilder += addParagraph(contents.body[i]);
            }
        }
        if (_hasQuestions) {
            bodyBuilder = '<form>'+ bodyBuilder + '</form>';
        }
        return '<div data-antn-type="annotation">'+ headerBuilder + bodyBuilder +'</div>';
    }

    function addHeader (header) {
        var headerBuilder = '';
        function _addSubtext (text) {
            return '<div data-antn-type="subtext">'+ text +'</div>';
        }
        if (header.title) {
            headerBuilder += '<h1 data-antn-type="header">'+ header.title + '</h1>';
        }
        if (header.subtext) {
            if (typeof header.subtext === 'string') {
                headerBuilder += _addSubtext(header.subtext);
            } else {
                header.subtext.forEach(function (text) {
                    headerBuilder += _addSubtext(text);
                });
            }
        }
        return headerBuilder;
    }

    function addParagraph (contents) {
        var paragraphBuilder = '';
        for (var i = 0, n = contents.length; i < n; ++i) {
            if (typeof contents[i] !== 'string') {
                paragraphBuilder += addAnnotation(contents[i])
            } else {
                paragraphBuilder += contents[i];
            }
        }
        return '<p data-antn-type="paragraph">'+ paragraphBuilder +'</p>';
    }

    function addAnnotation (content) {
        var annotationBuilder = '';
        var index = _counter++;
        if (content.hasOwnProperty('question')) {
            _hasQuestions = true;
            annotationBuilder += content.question;
            annotationBuilder += '<textarea data-antn-type="input" data-antn-index="'+ index +'"></textarea>';
        } else {
            annotationBuilder += content.instruction;
        }
        annotationBuilder = '<div data-antn-type="callout" data-antn-index="'+ index +'">'+ annotationBuilder +'</div>';
        annotationBuilder += '<a data-antn-type="inline" data-antn-index="'+ index +'">'+ content.text + '</a>';
        return annotationBuilder;
    }

    function addMarker (marker) {
        return '<h2 data-antn-type="marker">'+ marker +'</h2>'
    }

    return {
        count: _counter,
        addBlock: addBlock
    };

});