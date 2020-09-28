"use strict";
/**
 * The main purpose of this module is to provide utility functions
 * that follows the restrictions of the Bookshelf/Mapper/Serializer APIs
 * with the goal of simplifying the logic of the main 'map' method.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.processData = void 0;
var lodash_1 = require("lodash");
var links_1 = require("./links");
var extras_1 = require("./extras");
/**
 * Start the data processing with top level information,
 * then handle resources recursively in processSample
 */
function processData(info, data) {
    var enableLinks = info.bookOpts.enableLinks, linkOpts = info.linkOpts;
    var template = processSample(info, sample(data));
    if (enableLinks) {
        template.dataLinks = links_1.dataLinks(linkOpts);
        template.topLevelLinks = links_1.topLinks(linkOpts);
    }
    return template;
}
exports.processData = processData;
/**
 * Recursively adds data-related properties to the
 * template to be sent to the serializer
 */
function processSample(info, sample) {
    var bookOpts = info.bookOpts, linkOpts = info.linkOpts;
    var enableLinks = bookOpts.enableLinks;
    var template = {
        // Add list of valid attributes
        attributes: getAttrsList(sample, bookOpts)
    };
    // Nested relations (recursive) template generation
    lodash_1.forOwn(sample.relations, function (relSample, relName) {
        if (!relationAllowed(bookOpts, relName)) {
            return;
        }
        var relLinkOpts = lodash_1.assign(lodash_1.clone(linkOpts), { type: relName });
        var relTemplate = processSample({ bookOpts: bookOpts, linkOpts: relLinkOpts }, relSample);
        relTemplate.ref = 'id'; // Add reference in nested resources
        // Related links
        if (enableLinks) {
            relTemplate.relationshipLinks = links_1.relationshipLinks(linkOpts, relName);
            relTemplate.includedLinks = links_1.includedLinks(relLinkOpts);
        }
        // Include links as compound document
        if (!includeAllowed(bookOpts, relName)) {
            relTemplate.included = false;
        }
        template[relName] = relTemplate;
        template.attributes.push(relName);
    });
    return template;
}
/**
 * Convert any data into a model representing
 * a complete sample to be used in the template generation
 */
function sample(data) {
    if (extras_1.isModel(data)) {
        // Override type because we will overwrite relations
        var sampled = lodash_1.cloneDeep(lodash_1.omit(data, 'relations'));
        sampled.relations = lodash_1.mapValues(data.relations, sample);
        return sampled;
    }
    else if (extras_1.isCollection(data)) {
        var first = data.first();
        var rest = data.slice(1);
        return lodash_1.reduce(rest, mergeSample, sample(first));
    }
    else {
        return {};
    }
}
/**
 * Merge two models into a representation of both
 */
function mergeSample(main, toMerge) {
    var sampled = sample(toMerge);
    main.attributes = lodash_1.merge(main.attributes, sampled.attributes);
    main.relations = lodash_1.merge(main.relations, sampled.relations);
    return main;
}
function matches(matcher, str) {
    var reg;
    if (typeof matcher === 'string') {
        reg = RegExp("^" + lodash_1.escapeRegExp(matcher) + "$");
    }
    else {
        reg = matcher;
    }
    return reg.test(str);
}
/**
 * Retrieve model's attribute names
 * following filtering rules
 */
function getAttrsList(data, bookOpts) {
    var idAttr = data.idAttribute;
    if (lodash_1.isString(idAttr)) {
        idAttr = [idAttr];
    }
    else if (lodash_1.isUndefined(idAttr)) {
        idAttr = [];
    }
    var attrs = lodash_1.keys(data.attributes);
    var outputVirtuals = data.outputVirtuals;
    if (!lodash_1.isNil(bookOpts.outputVirtuals)) {
        outputVirtuals = bookOpts.outputVirtuals;
    }
    if (data.virtuals && outputVirtuals) {
        attrs = attrs.concat(lodash_1.keys(data.virtuals));
    }
    var _a = bookOpts.attributes, attributes = _a === void 0 ? { omit: idAttr } : _a;
    // cast it to the object version of the option
    if (attributes instanceof Array) {
        attributes = { include: attributes };
    }
    var omit = attributes.omit, include = attributes.include;
    return lodash_1.filter(attrs, function (attr) {
        var included = true;
        var omitted = false;
        if (include) {
            included = lodash_1.some(include, function (m) { return matches(m, attr); });
        }
        if (omit) {
            omitted = lodash_1.some(omit, function (m) { return matches(m, attr); });
        }
        // `omit` has more precedence than `include` option
        return !omitted && included;
    });
}
/**
 * Based on Bookshelf options, determine if a relation must be included
 */
function relationAllowed(bookOpts, relName) {
    var relations = bookOpts.relations;
    if (typeof relations === 'boolean') {
        return relations;
    }
    else {
        var fields = relations.fields;
        return !fields || lodash_1.includes(fields, relName);
    }
}
/**
 * Based on Bookshelf options, determine if a relation must be included
 */
function includeAllowed(bookOpts, relName) {
    var relations = bookOpts.relations;
    if (typeof relations === 'boolean') {
        return relations;
    }
    else {
        var fields = relations.fields, included = relations.included;
        if (typeof included === 'boolean') {
            return included;
        }
        else {
            // If included is an array, only allow relations that are in that array
            var allowed = included;
            if (fields) {
                // If fields specified, ensure that the included relations
                // are listed as one of the relations to be serialized
                allowed = lodash_1.intersection(fields, included);
            }
            return lodash_1.includes(allowed, relName);
        }
    }
}
/**
 * Convert a bookshelf model or collection to
 * json adding the id attribute if missing
 */
function toJSON(data) {
    var json = null;
    if (extras_1.isModel(data)) {
        json = data.toJSON({ shallow: true }); // serialize without the relations
        // When idAttribute is a composite id, calling .id returns `undefined`
        var idAttr = data.idAttribute;
        if (lodash_1.isArray(idAttr)) {
            // the id will be the values in order separated by comma
            data.id = lodash_1.map(idAttr, function (attr) { return data.attributes[attr]; }).join(',');
        }
        // Assign the id for the model if it's not present already
        if (!lodash_1.has(json, 'id')) {
            json.id = data.id;
        }
        lodash_1.update(json, 'id', lodash_1.toString);
        // Loop over model relations to call toJSON recursively on them
        lodash_1.forOwn(data.relations, function (relData, relName) {
            json[relName] = toJSON(relData);
        });
    }
    else if (extras_1.isCollection(data)) {
        // Run a recursive toJSON on each model of the collection
        json = data.map(toJSON);
    }
    return json;
}
exports.toJSON = toJSON;
//# sourceMappingURL=utils.js.map