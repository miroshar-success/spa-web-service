import { TableStateShape } from '@redux/common/table/types';

export interface AuthorsState extends TableStateShape{ }

export interface Author  {    
    key: string;
    _id: string,
    name: string; 
    surname: string;
    lifetime: Date;  
    data: DataType;
    searchString: string;
    loading: boolean;
    error: string;  
}

export type DataType = Array<Author>