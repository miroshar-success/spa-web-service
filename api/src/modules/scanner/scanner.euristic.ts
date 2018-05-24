import {AllegroEuristic} from './euristic/euristic.allegro';
import {DefaultEuristic} from './euristic/euristic.default';
import {CssValue} from './scanner.csspath';

export class EuristicMeta {
    url: URL;
}


export class EuristicOrderService {

    static services = {
        //'allegro.pl': new AllegroEuristic(),
        'default': new DefaultEuristic()
    };

    static compute = (samples: CssValue[], meta: EuristicMeta): number => {
        if(meta === undefined || meta.url === undefined)
            return EuristicOrderService.services.default.compute(samples, meta);
        const key = meta.url.host;
        if (EuristicOrderService.services[key] === undefined)
            return EuristicOrderService.services.default.compute(samples, meta);
        else
            return EuristicOrderService.services[key].compute(samples, meta);
    };

    static compare = (a: CssValue[], b: CssValue[], meta: EuristicMeta): number => {
        return EuristicOrderService.compute(a, meta) - EuristicOrderService.compute(b, meta);
    };
}

