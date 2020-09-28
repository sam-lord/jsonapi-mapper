import { SerialOpts } from '../serializer';
import { Mapper, MapOpts } from '../interfaces';
import { Data } from './extras';
/**
 * Mapper class for Bookshelf sources
 */
export declare class Bookshelf implements Mapper {
    baseUrl: string;
    serialOpts?: SerialOpts | undefined;
    /**
     * Standard constructor
     */
    constructor(baseUrl: string, serialOpts?: SerialOpts | undefined);
    /**
     * Maps bookshelf data to a JSON-API 1.0 compliant object
     *
     * The `any` type data source is set for typing compatibility, but must be removed if possible
     * TODO fix data any type
     */
    map(data: Data | any, type: string, mapOpts?: MapOpts): any;
}
