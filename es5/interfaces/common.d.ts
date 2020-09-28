import { PagOpts, QueryOpts } from './links';
import { RelationTypeOpt, RelationOpts } from './relations';
export interface Mapper {
    map(data: any, type: string, mapOpts?: MapOpts): any;
}
export declare type AttrMatcher = RegExp | string;
export declare type AttributesOpt = {
    omit?: AttrMatcher[];
    include?: AttrMatcher[];
};
export interface MapOpts {
    attributes?: AttrMatcher[] | AttributesOpt;
    keyForAttr?: (attr: string) => string;
    relations?: boolean | RelationOpts;
    typeForModel?: RelationTypeOpt;
    enableLinks?: boolean;
    pagination?: PagOpts;
    query?: QueryOpts;
    meta?: {
        [key: string]: any;
    };
    outputVirtuals?: boolean;
}
