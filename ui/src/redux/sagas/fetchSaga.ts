import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  FetchKeys,
  Fetch,
  Pagination
} from '@redux/fetch/types';

import axios from 'axios';

const fetchFetchs = (url: string) => {
  return axios.get(url)
    .then(response => response.data)
    .catch(error => error)
}

// worker sagas
function* loadFetchs(url: string, currentPage: number, needDelay: boolean): IterableIterator<any> {
  try {
    if (needDelay) {
      yield call(delay, 500);
    }

    const { docs: fetchs, total } = yield call(fetchFetchs, url);
    yield put({
      type: FetchKeys.LOAD_FETCHS_SUCCESS,
      payload: {
        persons: fetchs.map((fetch: Fetch) => ({
          // key: personKey,
          // clientName,
          // personKey,
          // personInfo,
        })),
        pagination: {
          current: currentPage,
          total,
        }
      },
    })
  } catch (error) {
    yield put({
      type: FetchKeys.LOAD_FETCHS_FAILURE,
      payload: {
        error: error.message,
      }
    })
  }
}

// watcher sagas
export function* loadFetchsSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { pagination } } = yield take(FetchKeys.LOAD_FETCHS);
    yield fork(loadFetchs, buildUrlForLoadFetchs(pagination), pagination.current, false);
  }
}

export function* searchFetchSaga(): IterableIterator<any> {
  let task
  while (true) {
    const { payload: { value } } = yield take(FetchKeys.SEARCH_FETCHS);
    if (task) {
      yield cancel(task)
    }
    task = yield fork(loadFetchs, buildUrlForLoadFetchs(value), 1, true);
  }
}

// helpers
const buildUrlForLoadFetchs = (params: Pagination | string): string => {
  const prefix = '/fetch';
  if (typeof params === 'string') {
    return `${prefix}/find?search=${params}`
  } else {
    const { pageSize, current } = params;
    return `${prefix}?offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
  }
}