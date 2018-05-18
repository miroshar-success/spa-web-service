import { take, call, put, fork, cancel, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  PersonKeys,
  Person,
  Pagination,
} from '@redux/persons/types';
import { getSearchString } from '@redux/persons/reducer';

import axios from 'axios';

const fetchPersons = (url: string) => {
  return axios.get(url)
    .then(response => response.data)
    .catch(error => error)
}

// worker sagas
function* loadPersons(url: string, currentPage: number, needDelay: boolean): IterableIterator<any> {
  try {
    if (needDelay) {
      yield call(delay, 500);
    }

    const { docs: persons, total } = yield call(fetchPersons, url);
    yield put({
      type: PersonKeys.LOAD_PERSONS_SUCCESS,
      payload: {
        persons: persons.map(({ _id, clientName, personKey, personInfo }: Person) => ({
          key: _id,
          clientName,
          personKey,
          personInfo,
        })),
        pagination: {
          current: currentPage,
          total,
        }
      },
    })
  } catch (error) {
    yield put({
      type: PersonKeys.LOAD_PERSONS_FAILURE,
      payload: {
        error: error.message,
      }
    })
  }
}

// watcher sagas
export function* loadPersonsSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { pagination } } = yield take(PersonKeys.LOAD_PERSONS);
    const searchString = yield select(getSearchString);
    yield fork(loadPersons, buildUrlForLoadUsers(pagination, searchString), pagination.current, false);
  }
}

export function* searchPersonSaga(): IterableIterator<any> {
  let task
  while (true) {
    const { payload: { value } } = yield take(PersonKeys.SEARCH_PERSON);
    if (task) {
      yield cancel(task)
    }
    task = yield fork(loadPersons, buildUrlForLoadUsers(value), 1, true);
  }
}

// helpers
const buildUrlForLoadUsers = (params: Pagination | string, searchString?: string): string => {
  const prefix = '/person';
  if (typeof params === 'string') {
    return `${prefix}/find?search=${encodeURIComponent(params)}`
  } else {
    const { pageSize, current } = params;
    return `${prefix}?value=${searchString}&offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
  }
}