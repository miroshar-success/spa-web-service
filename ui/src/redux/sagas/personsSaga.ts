import { fork } from 'redux-saga/effects';
import { Person } from '@redux/persons/types';
import { loadDataSaga, searchDataSaga } from '@redux/common/table/sagas';
import { TableReducerNameSubscribers } from '@redux/common/table/types';

const prefix = TableReducerNameSubscribers.PERSONS

// watcher sagas
export function* loadPersonsSaga(): IterableIterator<any> {
  yield fork(loadDataSaga, prefix, getSuccessPayload);
}

export function* searchPersonSaga(): IterableIterator<any> {
  yield fork(searchDataSaga, prefix, getSuccessPayload);
}

// helpers
const getSuccessPayload = (persons: Array<Person>) => {
  return persons.map(({ _id, clientName, personKey, personInfo }: Person) => ({
    key: _id,
    clientName,
    personKey,
    personInfo,
  }))
}