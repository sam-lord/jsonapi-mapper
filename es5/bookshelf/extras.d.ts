/**
 * The purpose of this module is to extend the initially defined properties,
 * behaviors and characteristics of the bookshelf API
 */
import { Model as BModel, Collection as BCollection } from 'bookshelf';
import { MapOpts, RelationTypeOpt, RelationOpts } from '../interfaces';
export interface BookOpts extends MapOpts {
    keyForAttr: (attr: string) => string;
    relations: boolean | RelationOpts;
    typeForModel: RelationTypeOpt;
    enableLinks: boolean;
    outputVirtuals?: boolean;
}
/**
 * Internal form of the relations property of bookshelf objects
 */
export interface RelationsObject {
    [relationName: string]: Data;
}
export interface Attributes {
    [attrName: string]: any;
}
/**
 * Bookshelf Model including some private properties
 */
export interface Model extends BModel<any> {
    id: any;
    idAttribute: any;
    attributes: Attributes;
    relations: RelationsObject;
    virtuals?: any;
    outputVirtuals?: boolean;
}
/**
 * Bookshelf Collection including some private properties
 */
export interface Collection extends BCollection<any> {
    models: Model[];
    length: number;
}
export declare type Data = Model | Collection;
/**
 * Bookshelf Model Type Guard
 * https://basarat.gitbooks.io/typescript/content/docs/types/typeGuard.html
 */
export declare function isModel(data: Data): data is Model;
/**
 * Bookshelf Collection Type Guard
 * https://basarat.gitbooks.io/typescript/content/docs/types/typeGuard.html
 */
export declare function isCollection(data: Data): data is Collection;
