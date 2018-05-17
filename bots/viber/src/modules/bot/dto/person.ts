export class Person {
    readonly personKey: string;
    readonly personInfo: PersonInfo;

    constructor(personKey: string, personInfo: PersonInfo){
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