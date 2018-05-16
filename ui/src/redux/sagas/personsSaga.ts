import { take, call, put, fork } from 'redux-saga/effects';
import {
  PersonKeys,
  Person,
  Pagination,
} from '@redux/persons/types';

import axios from 'axios';

const fetchPersons = (url: string) => {
  return axios.get(url)
    .then(response => response.data)
    .catch(error => error)
}

// worker sagas
function* loadPersons(url: string, currentPage: number): IterableIterator<any> {
  try {
    const { docs: persons, total } = yield call(fetchPersons, url);
    console.log(persons)
    yield put({
      type: PersonKeys.LOAD_PERSONS_SUCCESS,
      payload: {
        persons: persons.map(({ clientName, personKey, personInfo }: Person) => ({
          key: personKey,
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
    yield fork(loadPersons, buildUrlForLoadUsers(pagination), pagination.current);
  }
}

export function* searchPersonSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { value } } = yield take(PersonKeys.SEARCH_PERSON);
    yield fork(loadPersons, buildUrlForLoadUsers(value), 1);
  }
}

// helpers
const buildUrlForLoadUsers = (params: Pagination | string): string => {
  const prefix = '/person';
  if (typeof params === 'string') {
    return `${prefix}/find?search=${params}`
  } else {
    const { pageSize, current } = params;
    return `${prefix}?offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
  }
}