import { EuristicMeta} from '../scanner.euristic';
import {Euristic} from './eurictic';

export class AllegroEuristic extends Euristic {
    computeOne(samples: string, meta: EuristicMeta): number {
        return samples.endsWith('html') ? 1 : 0.1;
    };
}