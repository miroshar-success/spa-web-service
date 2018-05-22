import {EuristicMeta} from '../scanner.euristic';

export abstract class Euristic {
    compute(samples: string[], meta: EuristicMeta): number {
        return samples.reduce((sum, x) => sum + this.computeOne(x, meta), 0);
    };

    abstract computeOne(samples: string, meta: EuristicMeta): number;
}