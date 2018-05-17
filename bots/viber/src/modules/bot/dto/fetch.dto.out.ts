import {Person} from './person';

export class FetchExploreDtoOut{
    readonly clientName: string;
    readonly fetchUrl: string;
    readonly person: Person;

    constructor(fetchUrl: string, person: Person){
        this.clientName = 'viber';
        this.fetchUrl = fetchUrl;
        this.person = person;
    }
}

export class FetchDtoOut extends FetchExploreDtoOut {
    readonly sampleUrl: string;

    constructor(fetchUrl: string, person: Person, sampleUrl: string){
        super(fetchUrl, person);
        this.sampleUrl = sampleUrl;
    }
}


