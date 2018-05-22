import { take, call, put, fork, cancel, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { TableActions, Pagination, LoadDataProps, RemoveDataProps } from './types';
import { getSearchString, getPagination } from './reducer';
import * as Api from './api';

// worker sagas
function* loadData(params: LoadDataProps): IterableIterator<any> {
  const {
    prefix,
    url,
    currentPage,
    needDelay,
    payloadFunc,
  } = params;

  try {
    if (needDelay) {
      yield call(delay, 500);
    }

    const { docs, total } = yield call(Api.fetchData, url);

    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_SUCCESS}`,
      payload: {
        data: payloadFunc(docs),
        pagination: {
          current: currentPage,
          total,
        }
      },
    })
  } catch (error) {
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* removeData(params: RemoveDataProps): IterableIterator<any> {
  const {
    prefix,
    id,
    payloadFunc,
  } = params;

  try {
    const searchString = yield select(getSearchString, prefix);
    const { data } = yield call(Api.removeData, id, searchString);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(newPagination, prefix, searchString),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
      payload: {
        error: error.message,
      }
    })
  }
}

// watcher sagas
export function* loadDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { pagination } } = yield take(`${prefix}/${TableActions.LOAD_DATA}`);
    const searchString = yield select(getSearchString, prefix);
    yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(pagination, prefix, searchString),
      currentPage: pagination.current,
      needDelay: false,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* searchDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  let task
  while (true) {
    const { payload: { value } } = yield take(`${prefix}/${TableActions.SEARCH_DATA}`);
    if (task) {
      yield cancel(task)
    }
    task = yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(value, prefix),
      currentPage: 1,
      needDelay: true,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* removeDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { id } } = yield take(`${prefix}/${TableActions.REMOVE_DATA}`);
    yield fork(removeData, {
      prefix,
      id,
      payloadFunc: getSuccessPayload,
    });
  }
}

// helpers
const buildUrlForLoadData = (params: Pagination | string, prefix: string, searchString?: string): string => {
  const fullPrefix = `data/${prefix.slice(2)}`;
  if (typeof params === 'string') {
    return `${fullPrefix}/find?search=${encodeURIComponent(params)}`
  } else {
    const { pageSize, current } = params;
    return `${fullPrefix}?value=${searchString}&offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
  }
}

const updatePaginationIfNeeded = (pagination: Pagination, total: number): Pagination => {
  const {
    pageSize,
    current
  } = pagination;

  if (total <= pageSize * (current - 1)) {
    return {
      pageSize,
      current: Math.ceil(total / pageSize),
      total,
    }
  }
  return pagination
}