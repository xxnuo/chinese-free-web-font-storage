import { createContext } from 'solid-js';
import type { FontReporter } from 'cn-font-split';

export interface DetailContextType {
    reporter: FontReporter;
    packageName: string;
    subName: string;
    cnName: string;
}
export const DetailedContext = createContext<DetailContextType>();
