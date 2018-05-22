import {EuristicMeta} from '../scanner.euristic';
import {Euristic} from './eurictic';

export class DefaultEuristic extends Euristic {
    computeOne(samples: string, meta: EuristicMeta): number {
        return 1;
    }

    compute(samples: string[], meta: EuristicMeta): number {
        return samples.length;
    }
}