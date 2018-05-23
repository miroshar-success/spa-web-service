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

export class Person {
    readonly personKey: object;
    readonly personInfo: PersonInfo;

    constructor(personKey: object, personInfo: PersonInfo){
        this.personKey = personKey;
        this.personInfo = personInfo;
    }
}

export class PersonInfo {
    readonly id: string;
    readonly name: string;
    readonly country: string;
    readonly language: string;

    constructor(id: string, name: string, country: string, language: string){
        this.id = id;
        this.name = name;
        this.country = country;
        this.language = language;
    }
}

export class PersonCoreDtoOut extends  Person {
    readonly clientName: string;

    constructor (personKey: object, personInfo: PersonInfo) {
        super(personKey, personInfo);
        this.clientName = 'viber';
    }
}


