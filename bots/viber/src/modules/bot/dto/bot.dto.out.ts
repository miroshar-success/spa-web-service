export class ExploreDtoOut {
    readonly fetchUrl: string;
    readonly person: PersonDtoOut;

    constructor(fetchUrl: string, person: PersonDtoOut) {
        this.fetchUrl = fetchUrl;
        this.person = person;
    }
}

export class FetchDtoOut extends ExploreDtoOut {
    readonly sampleUrl: string;

    constructor(fetchUrl: string, person: PersonDtoOut, sampleUrl: string) {
        super(fetchUrl, person);
        this.sampleUrl = sampleUrl;
    }
}

export class PersonDtoOut {
    readonly clientName: string;
    readonly personKey: object;
    readonly personInfo: PersonInfo;

    constructor(personKey: object, personInfo: PersonInfo) {
        this.clientName = 'viber';
        this.personKey = personKey;
        this.personInfo = personInfo;
    }
}

export class PersonInfo {
    readonly id: string;
    readonly name: string;
    readonly country: string;
    readonly language: string;

    constructor(id: string, name: string, country: string, language: string) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.language = language;
    }
}




