/**
 * The main purpose of this module is to provide utility functions
 * that follows the restrictions of the Bookshelf/Mapper/Serializer APIs
 * with the goal of simplifying the logic of the main 'map' method.
 */
import { LinkOpts } from '../interfaces';
import { SerialOpts } from '../serializer';
import { BookOpts, Data } from './extras';
/**
 * Main structure used through most utility and recursive functions
 */
export interface Information {
    bookOpts: BookOpts;
    linkOpts: LinkOpts;
}
/**
 * Start the data processing with top level information,
 * then handle resources recursively in processSample
 */
export declare function processData(info: Information, data: Data): SerialOpts;
/**
 * Convert a bookshelf model or collection to
 * json adding the id attribute if missing
 */
export declare function toJSON(data: Data): any;
