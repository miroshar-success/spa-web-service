import * as Agenda from 'agenda';
import * as os from "os";

export const agendaProviders = [
    {
        provide: 'agendaModelToken',
        useFactory: async (): Promise<Agenda> => {
            let agenda: Agenda = await new Agenda(
                {db: {address: 'mongodb://beagle-mongo:27017/agenda'}});
            agenda.name(os.hostname + '-' + process.pid);
            agenda.start();

            function failGracefully() {
                agenda.stop(() => process.exit(0));
            }

            process.on('SIGTERM', failGracefully);
            process.on('SIGINT', failGracefully);

            return agenda;
        }
    }
];


