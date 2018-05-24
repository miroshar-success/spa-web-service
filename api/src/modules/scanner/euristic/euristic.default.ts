import {EuristicMeta} from '../scanner.euristic';
import {Euristic} from './eurictic';
import {CssValue} from '../scanner.csspath';

export class DefaultEuristic extends Euristic {
    computeOne(samples: CssValue, meta: EuristicMeta): number {
        return 1;
    }

    compute(samples: CssValue[], meta: EuristicMeta): number {
        return samples.length;
    }
}