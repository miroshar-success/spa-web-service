
/** /fetch/explore & /delete **/
export class FetchExploreDtoOut {
    readonly person: PersonCoreDtoOut;
    readonly fetchUrl: string;

    constructor(person: PersonCoreDtoOut, fetchUrl: string) {
        this.person = person;
        this.fetchUrl = fetchUrl;
    }
}

/** /fetch **/
export class FetchDtoOut extends FetchExploreDtoOut {
    readonly sampleUrl: string;

    constructor(person: PersonCoreDtoOut, fetchUrl: string, sampleUrl: string) {
        super(person, fetchUrl);
        this.sampleUrl = sampleUrl;
    }
}

/** /get **/
export class PersonCoreDtoOut {
    readonly clientName;
    readonly personKey;
    readonly personInfo: PersonInfo;

    constructor(personKey, personInfo: PersonInfo) {
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






