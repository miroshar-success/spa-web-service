
import { take, call, put, fork, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { TableActions } from '@redux/common/table/types';
import { UserFetchsActions, FetchSample } from '@redux/userFetchs/types';
import { getUserDetails } from '@redux/auth/reducer';
import * as Api from '@redux/userFetchs/api';
import { saveExploredFetchSamples, saveFetchResults } from '@redux/userFetchs/actions';
import { AuthActions, UserDetails } from '@redux/auth/types';


// worker sagas
function* loadUserFetchs(personKey: string): IterableIterator<any> {
  try {
    const response = yield call(Api.fetchData, personKey);

    yield put({
      type: TableActions.LOAD_DATA_SUCCESS,
      payload: {
        data: response.data.map((dataItem: any) => {
          return {
            key: '123',
            fetchUrl: dataItem.fetchUrl,
          }
        })
      },
    })
  } catch (error) {
    // TODO: handle errors
  }
}

function* initWebsocket() {
  const userDetails: UserDetails = yield select(getUserDetails);

  return eventChannel(emit => {
    const ws = new WebSocket('ws://localhost:9000');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'ADD_USER',
        name: userDetails.name,
      }))
    }

    ws.onmessage = (event) => {
      const { type: actionType, payload } = JSON.parse(event.data);
      const payloadObj = JSON.parse(payload);

      switch (actionType) {
        case UserFetchsActions.SAVE_EXPLORED_FETCH_SAMPLES: {
          const { fetchUrl, samples } = payloadObj;
          return emit(saveExploredFetchSamples(
            {
              key: fetchUrl,
              fetchUrl,
            },
            mapFetchs(samples as FetchSample[]),
          ));
        }
        case UserFetchsActions.SAVE_FETCH_RESULTS: {
          const fetchResults = mapFetchs(payloadObj.resultUrls as FetchSample[]);
          return emit(saveFetchResults(fetchResults));
        }
      }
    }

    ws.onclose = () => {
      alert('close');
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
    // TODO: handle errors
  }
}

function* watchFetch(fetchUrl: string, sampleUrl: string, personKey: string): IterableIterator<any> {
  try {
    yield call(Api.createFetch, fetchUrl, sampleUrl, personKey);
  } catch (error) {
    // TODO: handle errors
  }
}

function* removeFetch(fetchUrl: string, personKey: string): IterableIterator<any> {
  try {
    yield call(Api.removeFetch, fetchUrl, personKey);
    // review this
    yield fork(loadUserFetchs, personKey)
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
  yield take(AuthActions.INIT_WEBSOCKET);
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

export function* removeFetchSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { fetchUrl } } = yield take(UserFetchsActions.REMOVE_FETCH);
    const userDetails = yield select(getUserDetails);
    yield fork(removeFetch, fetchUrl, userDetails.name);
  }
}

// helpers

const mapFetchs = (fetchs: FetchSample[]) => {
  return fetchs.map(({ url, meta: { title, image } }) => ({
    key: url,
    url,
    title,
    image,
  }))
}