import { createNamedTableReducer, tableReducer } from '@redux/common/table/reducer';

export const authorsReducer = createNamedTableReducer(tableReducer, '@@authors');