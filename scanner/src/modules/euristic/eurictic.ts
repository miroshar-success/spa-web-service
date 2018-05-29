import {EuristicMeta} from '../scanner.euristic';
import {CssValue} from '../scanner.csspath';

export abstract class Euristic {
    compute(samples: CssValue[], meta: EuristicMeta): number {
        return samples.reduce((sum, x) => sum + this.computeOne(x, meta), 0);
    };

    abstract computeOne(samples: CssValue, meta: EuristicMeta): number;
}