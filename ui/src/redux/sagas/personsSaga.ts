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

function* loadPersons({ pageSize, current }: Pagination): IterableIterator<any> {
  try {
    const { docs: persons, limit, total } = yield call(fetchPersons, `/person?offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`);
    yield put({
      type: PersonKeys.LOAD_PERSONS_SUCCESS,
      payload: {
        persons: persons.map(({ _id, personType, personId }: Person) => ({
          key: _id,
          personType,
          personId,
        })),
        pagination: {
          pageSize: limit,
          current,
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

export default function* loadPersonsSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { pagination } } = yield take(PersonKeys.LOAD_PERSONS);
    yield fork(loadPersons, pagination);
  }
}