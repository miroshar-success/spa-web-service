import { EuristicMeta} from '../scanner.euristic';
import {Euristic} from './eurictic';
import {CssValue} from '../scanner.csspath';

export class AllegroEuristic extends Euristic {
    computeOne(samples: CssValue, meta: EuristicMeta): number {
        return samples.href.endsWith('html') ? 1 : 0.1;
    };
}