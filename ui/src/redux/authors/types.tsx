import { TableStateShape } from "@redux/common/table/types";

export interface AuthorsState extends TableStateShape {}

export interface Author  {    
    key: string;
    _id: string,
    name: string; 
    surname: string;
    dob: string;
    dod: string;  
}

export interface LoadDataProps {
    prefix: string;
    url: string;
    needDelay: boolean;
    payloadFunc: Function;
    searchString: string;
  }