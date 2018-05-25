import { ClientName, TableStateShape } from '@redux/common/table/types';

export interface PersonsState extends TableStateShape { }

// define Person model
export interface Person {
  _id: string;
  clientName: ClientName;
  personKey: object;
  personInfo: PersonInfo;
}

export interface PersonInfo {
  name?: string;
  surname?: string;
}