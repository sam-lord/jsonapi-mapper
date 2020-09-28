"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookshelf = void 0;
var lodash_1 = require("lodash");
var inflection_1 = require("inflection");
var serializer_1 = require("../serializer");
var utils_1 = require("./utils");
/**
 * Mapper class for Bookshelf sources
 */
var Bookshelf = /** @class */ (function () {
    /**
     * Standard constructor
     */
    function Bookshelf(baseUrl, serialOpts) {
        this.baseUrl = baseUrl;
        this.serialOpts = serialOpts;
    }
    /**
     * Maps bookshelf data to a JSON-API 1.0 compliant object
     *
     * The `any` type data source is set for typing compatibility, but must be removed if possible
     * TODO fix data any type
     */
    Bookshelf.prototype.map = function (data, type, mapOpts) {
        if (mapOpts === void 0) { mapOpts = {}; }
        // Set default values for the options
        var attributes = mapOpts.attributes, _a = mapOpts.keyForAttr, keyForAttr = _a === void 0 ? lodash_1.identity : _a, _b = mapOpts.relations, relations = _b === void 0 ? true : _b, _c = mapOpts.typeForModel, typeForModel = _c === void 0 ? function (attr) { return inflection_1.pluralize(attr); } : _c, _d = mapOpts.enableLinks, enableLinks = _d === void 0 ? true : _d, pagination = mapOpts.pagination, query = mapOpts.query, meta = mapOpts.meta, outputVirtuals = mapOpts.outputVirtuals;
        var bookOpts = {
            attributes: attributes, keyForAttr: keyForAttr,
            relations: relations, typeForModel: typeForModel,
            enableLinks: enableLinks, pagination: pagination,
            query: query, outputVirtuals: outputVirtuals
        };
        var linkOpts = { baseUrl: this.baseUrl, type: type, pag: pagination };
        var info = { bookOpts: bookOpts, linkOpts: linkOpts };
        var template = utils_1.processData(info, data);
        var typeForAttribute = typeof typeForModel === 'function'
            ? typeForModel
            : function (attr) { return typeForModel[attr] || inflection_1.pluralize(attr); }; // pluralize when falsy
        // Override the template with the provided serializer options
        lodash_1.assign(template, { typeForAttribute: typeForAttribute, keyForAttribute: keyForAttr, meta: meta }, this.serialOpts);
        // Return the data in JSON API format
        var json = utils_1.toJSON(data);
        return new serializer_1.Serializer(type, template).serialize(json);
    };
    return Bookshelf;
}());
exports.Bookshelf = Bookshelf;
//# sourceMappingURL=index.js.map