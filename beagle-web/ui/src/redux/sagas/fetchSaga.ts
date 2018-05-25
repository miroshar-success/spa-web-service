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

// import { take, call, put, fork } from 'redux-saga/effects';
// import { eventChannel } from 'redux-saga';
// import { TableActions } from '@redux/common/table/types';
// import axios from 'axios';

// export const fetchData = (url: string, personKey: string) => {
//   return axios.post(url, {
//     clientName: 'beagleWeb',
//     personKey,
//     personInfo: null,
//   })
//     .then(response => response.data)
//     .catch(error => error)
// }

// // worker sagas
// function* loadFetchs(personKey: string): IterableIterator<any> {
//   try {

//     const data = yield call(fetchData, '/fetch/get', personKey);

//     yield put({
//       type: TableActions.LOAD_DATA_SUCCESS,
//       payload: {
//         fetchs: data.map((dataItem: any) => {
//           return {
//             fetchUrl: dataItem.fetchUrl,
//           }
//         })
//       },
//     })
//   } catch (error) {
//     // TODO: handle errors
//   }
// }

// function initWebsocket() {
//   return eventChannel(emit => {
//     const ws = new WebSocket('ws://localhost:9000');

//     ws.onopen = () => {
//       console.log('opening ...');
//       ws.send('admin');
//     }

//     ws.onmessage = (event) => {
//       console.log(event.data);
//     }

//     return () => {
//       ws.close();
//     }
//   })
// }

// // watcher sagas
// export function* loadFetchsSaga(): IterableIterator<any> {
//   while (true) {
//     const { payload: { personKey } } = yield take(TableActions.LOAD_DATA);
//     yield fork(loadFetchs, personKey);
//   }
// }

// export function* wsSaga(): IterableIterator<any> {
//   const channel = yield call(initWebsocket);
//   while (true) {
//     const action = yield take(channel);
//     yield put(action);
//   }
// }