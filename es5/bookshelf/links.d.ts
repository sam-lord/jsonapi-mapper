import { LinkOpts } from '../interfaces';
import { LinkObj } from '../serializer';
/**
 * Creates top level links object, for primary data and pagination links.
 */
export declare function topLinks(linkOpts: LinkOpts): LinkObj;
/**
 * Creates links object for a resource
 */
export declare function dataLinks(linkOpts: LinkOpts): LinkObj;
/**
 * Creates links object for a relationship
 */
export declare function relationshipLinks(linkOpts: LinkOpts, related: string): LinkObj;
/**
 * Creates links object for a related resource, to be used for the included's array
 */
export declare function includedLinks(linkOpts: LinkOpts): LinkObj;
