import { fork } from 'redux-saga/effects';
import { Fetch } from '@redux/fetch/types';
import { loadDataSaga, searchDataSaga, removeDataSaga } from '@redux/common/table/sagas';
import { TableReducerNameSubscribers } from '@redux/common/table/types';

const prefix = TableReducerNameSubscribers.FETCHS

// watcher sagas
export function* loadFetchsSaga(): IterableIterator<any> {
  yield fork(loadDataSaga, prefix, getSuccessPayload);
}

export function* searchFetchSaga(): IterableIterator<any> {
  yield fork(searchDataSaga, prefix, getSuccessPayload);
}

export function* removeFetchSaga(): IterableIterator<any> {
  yield fork(removeDataSaga, prefix, getSuccessPayload)
}

// helpers
const getSuccessPayload = (fetchs: Array<Fetch>) => {
  return fetchs.map((fetch: Fetch) => ({
    key: fetch._id,
    _id: fetch._id,
    clientName: fetch.clientName,
    createDate: fetch.createDate,
    fetchUrl: fetch.fetchUrl,
    lastResult: fetch.lastResult,
    personKey: fetch.personKey,
    selector: fetch.selector,
    selectors: fetch.selectors,
    state: fetch.state,
    updateDate: fetch.updateDate,
  }))
}