export enum PersonType {
  Telegram = 'Telegram',
  Viber = 'Viber',
}

export interface TelegramPerson {
  type: PersonType.Telegram
}

export interface ViberPerson {
  type: PersonType.Viber,
}

type PersonTypes =
  | TelegramPerson
  | ViberPerson;

export default PersonTypes;