"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtmlParams = exports.populusWaveformPCM = exports.populusCollectionChild = exports.populusHighlight = exports.mscMarkupMsgKey = exports.mscLocation = exports.mscPdfText = exports.mscMediaFragment = exports.mscPdfHighlight = exports.mscResourceData = exports.mscParent = exports.joinRule = exports.serverRoot = exports.lastViewed = exports.pdfStateType = void 0;
exports.pdfStateType = "com.open-tower.populus.pdf"; // increment to start over with a fresh event type
exports.lastViewed = "com.open-tower.populus.lastPositionViewed";
exports.serverRoot = "https://matrix.example.org";
exports.joinRule = "m.room.join_rules";
exports.mscParent = "com.open-tower.msc3574.markup.parent";
exports.mscResourceData = "com.open-tower.msc3574.markup.resource";
exports.mscPdfHighlight = "com.open-tower.msc3592.markup.pdf.highlight";
exports.mscMediaFragment = "com.open-tower.msc3775.markup.media.fragment";
exports.mscPdfText = "com.open-tower.msc3592.markup.pdf.text";
exports.mscLocation = "com.open-tower.msc3574.markup.location";
exports.mscMarkupMsgKey = "com.open-tower.msc3574.markup";
exports.populusHighlight = "com.open-tower.populus.markup.pdf.highlight";
exports.populusCollectionChild = "com.open-tower.populus.collection_child";
exports.populusWaveformPCM = "com.open-tower.populus.waveformPCM";
// based on https://github.com/matrix-org/matrix-react-sdk/blob/78b1f6c0b13efd57031a329a1ac62baba948dad3/src/HtmlUtils.tsx
var COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
var transformTags = {
    // add blank targets to all hyperlinks except vector URLs
    a: function (tagName, attribs) {
        if (attribs.href) {
            attribs.target = '_blank';
        }
        attribs.rel = 'noreferrer noopener'; // https://mathiasbynens.github.io/rel-noopener/
        return { tagName: tagName, attribs: attribs };
    },
    img: function (tagName) {
        // security for images is complicated, and they're not important for markdown right now.
        return { tagName: tagName, attribs: {} };
    },
    code: function (tagName, attribs) {
        if (typeof attribs.class !== 'undefined') {
            // Filter out all classes other than ones starting with language- for syntax highlighting.
            var classes = attribs.class.split(/\s/).filter(function (cl) {
                return cl.startsWith('language-') && !cl.startsWith('language-_');
            });
            attribs.class = classes.join(' ');
        }
        return { tagName: tagName, attribs: attribs };
    },
    '*': function (tagName, attribs) {
        // Delete any style previously assigned, style is an allowedTag for font and span
        // because attributes are stripped after transforming
        delete attribs.style;
        // Sanitise and transform data-mx-color and data-mx-bg-color to their CSS
        // equivalents
        var customCSSMapper = {
            'data-mx-color': 'color',
            'data-mx-bg-color': 'background-color'
        };
        var style = "";
        Object.keys(customCSSMapper).forEach(function (customAttributeKey) {
            var cssAttributeKey = customCSSMapper[customAttributeKey];
            var customAttributeValue = attribs[customAttributeKey];
            if (customAttributeValue &&
                typeof customAttributeValue === 'string' &&
                COLOR_REGEX.test(customAttributeValue)) {
                style += "".concat(cssAttributeKey, ":").concat(customAttributeValue, ";");
                delete attribs[customAttributeKey];
            }
        });
        if (style) {
            attribs.style = style;
        }
        return { tagName: tagName, attribs: attribs };
    }
};
exports.sanitizeHtmlParams = {
    allowedTags: [
        'font', // custom to matrix for IRC-style font coloring
        'del', // for markdown
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'sup', 'sub',
        'nl', 'li', 'b', 'i', 'u', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span', 'img',
        'details', 'summary'
    ],
    allowedAttributes: {
        // custom ones first:
        font: ['color', 'data-mx-bg-color', 'data-mx-color', 'style'], // custom to matrix
        span: ['data-mx-maths', 'data-mx-bg-color', 'data-mx-color', 'data-mx-spoiler', 'style'], // custom to matrix
        div: ['data-mx-maths'],
        a: ['href', 'name', 'target', 'rel'], // remote target: custom to matrix
        img: ['src', 'width', 'height', 'alt', 'title'],
        ol: ['start'],
        code: ['class'] // We don't actually allow all classes, we filter them in transformTags
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
    // URL schemes we permit
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'magnet'],
    allowProtocolRelative: false,
    transformTags: transformTags,
    // 50 levels deep "should be enough for anyone"
    nestingLimit: 50
};
