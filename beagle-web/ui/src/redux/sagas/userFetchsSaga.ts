
import { take, call, put, fork, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { TableActions } from '@redux/common/table/types';
import { UserFetchsActions } from '@redux/userFetchs/types';
import { getUserDetails } from '@redux/auth/reducer';
import * as Api from '@redux/userFetchs/api';


// worker sagas
function* loadUserFetchs(personKey: string): IterableIterator<any> {
  try {

    const data = yield call(Api.fetchData, '/fetch/get', personKey);

    yield put({
      type: TableActions.LOAD_DATA_SUCCESS,
      payload: {
        data: data.map((dataItem: any) => {
          return {
            fetchUrl: dataItem.fetchUrl,
          }
        })
      },
    })
  } catch (error) {
    // TODO: handle errors
  }
}

function initWebsocket() {
  return eventChannel(emit => {
    const ws = new WebSocket('ws://localhost:9000');

    ws.onopen = () => {
      // TODO: send correct user name
      ws.send('test');
    }

    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      const payloadObj = JSON.parse(payload);
      debugger
      switch (type) {
        case UserFetchsActions.ADD_NEW_FETCH_FOR_EXPLORE_SUCCESS: {
          return emit({
            type: UserFetchsActions.ADD_NEW_FETCH_FOR_EXPLORE_SUCCESS,
            payload: {
              fetch: {
                key: '12345',
                fetchUrl: payloadObj.fetchUrl,
              },
              sampleUrls: payloadObj.samples.map((sample: any) => ({
                key: sample.url,
                url: sample.url,
                title: sample.meta.title,
                image: sample.meta.image,
              })),
            },
          })
        }
        case UserFetchsActions.ADD_FETCH_RESULT: {
          debugger
          return emit({
            type: UserFetchsActions.ADD_FETCH_RESULT,
            payload: {
              resultUrls: payloadObj.resultUrls.map((result: any) => ({
                key: result.url,
                url: result.url,
                title: result.meta.title,
                image: result.meta.image,
              }))
            }
          })
        }
      }
    }

    return () => {
      ws.close();
    }
  })
}

function* addNewFetchUrlForExplore(fetchUrl: string, personKey: string): IterableIterator<any> {
  try {
    yield call(Api.createFetchExplore, fetchUrl, personKey);
  } catch (error) {

  }
}

function* watchFetch(fetchUrl: string, sampleUrl: string, personKey: string): IterableIterator<any> {
  try {
    yield call(Api.createWatchFetch, fetchUrl, sampleUrl, personKey);
  } catch (error) {

  }
}

// watcher sagas
export function* loadUserFetchsSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { personKey } } = yield take(TableActions.LOAD_DATA);
    yield fork(loadUserFetchs, personKey);
  }
}

export function* wsSaga(): IterableIterator<any> {
  const channel = yield call(initWebsocket);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export function* addNewFetchUrlForExploreSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { fetchUrl } } = yield take(UserFetchsActions.ADD_NEW_FETCH_FOR_EXPLORE);
    const userDetails = yield select(getUserDetails);
    yield fork(addNewFetchUrlForExplore, fetchUrl, userDetails.name);
  }
}

export function* watchFetchSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { fetchUrl, sampleUrl } } = yield take(UserFetchsActions.WATCH_FETCH);
    const userDetails = yield select(getUserDetails);
    yield fork(watchFetch, fetchUrl, sampleUrl, userDetails.name);
  }
}