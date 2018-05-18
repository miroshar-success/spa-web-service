import { take, call, put, fork, cancel, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  FetchKeys,
  Fetch,
  Pagination
} from '@redux/fetch/types';
import { getPagination, getSearchString } from '@redux/fetch/reducer';

import axios from 'axios';

const fetchFetchs = (url: string) => {
  return axios.get(url)
    .then(response => response.data)
    .catch(error => error)
}

const removeFetchRequest = (personKey: string) => {
  return axios.delete(`data/fetch/${personKey}`)
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
        fetchs: fetchs.map((fetch: Fetch) => ({
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

function* removeFetch(id: string): IterableIterator<any> {
  try {
    yield call(removeFetchRequest, id);
    const pagination = yield select(getPagination);
    yield call(loadFetchs, buildUrlForLoadFetchs(pagination, ''), pagination.current, false)
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
    const searchString = yield select(getSearchString);
    yield fork(loadFetchs, buildUrlForLoadFetchs(pagination, searchString), pagination.current, false);
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

export function* removeFetchSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { id } } = yield take(FetchKeys.REMOVE_FETCH);
    yield fork(removeFetch, id);
  }
}

// helpers
const buildUrlForLoadFetchs = (params: Pagination | string, searchString?: string): string => {
  const prefix = 'data/fetch';
  if (typeof params === 'string') {
    return `${prefix}/find?search=${encodeURIComponent(params)}`
  } else {
    const { pageSize, current } = params;
    return `${prefix}?value=${searchString}&offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
  }
}