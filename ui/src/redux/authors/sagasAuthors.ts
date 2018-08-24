import { take, call, put, fork, cancel, select} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { 
  TableActions, 
  Pagination, 
  LoadDataProps, 
  RemoveDataProps, 
  AddDataProps, 
  EditDataProps,
  } from '@redux/common/table/types';
import { getSearchString, getPagination } from '@redux/authors/reducer';
import * as Api from '@redux/authors/api';

// worker sagas
function* loadData(params: LoadDataProps): IterableIterator<any> {
  const {
    url,
    needDelay,
    payloadFunc,
  } = params;

  try {
    if (needDelay) {
      yield call(delay, 500);
    }

    const docs = yield call(Api.fetchData, url);

    yield put({
      type: `@@authors/LOAD_DATA_SUCCESS`,
      payload: {        
        data: payloadFunc(docs), 
      },
    })
  } catch (error) {
    yield put({
      type: `@@authors/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* searchData(params: LoadDataProps): IterableIterator<any> {
  const {
    searchString,
    needDelay,
    payloadFunc,
  } = params;

  try {
    if (needDelay) {
      yield call(delay, 500);
    }

    const docs = yield call(Api.searchAuthor, searchString);

    yield put({
      type: `@@authors/LOAD_DATA_SUCCESS`,
      payload: {        
        data: payloadFunc(docs.data.docs),
        
 
      },
    })
  } catch (error) {
    yield put({
      type: `@@authors/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* removeData(params: RemoveDataProps): IterableIterator<any> {
  const {
    _id,
    payloadFunc,
  } = params;

  try {
    const searchString = yield select(getSearchString);
    const { data } = yield call(Api.removeAuthor, _id, searchString);
    const pagination = yield select(getPagination);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      url: buildUrlForLoadData(newPagination),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    yield put({
      type: `@@authors/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* addData(params: AddDataProps): IterableIterator<any> {
  const {
    name,
    surname, 
    dob,
    dod,
    payloadFunc,
  } = params;

  try {
    
    const { data } = yield call(Api.addAuthor, name, surname, dob, dod);
    const pagination = yield select(getPagination);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      url: buildUrlForLoadData(newPagination),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    yield put({
      type: `@@authors/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* editData(params: EditDataProps): IterableIterator<any> {
  const {
    prefix,
    _id,
    name,
    surname,
    dod,
    dob,
    payloadFunc,
  } = params;

  try {    
    const { data } = yield call(Api.editAuthor,  dob, dod, surname, name,  _id);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination,  data)
    yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(newPagination),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    //console.log(error)
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
      payload: {
        error: error.message,
      }
    })
  }
}

// helpers
const buildUrlForLoadData = (params: Pagination | string): string => {
  if (typeof params === 'string') {
    return `http://localhost:4000/data/authors/find?search=${encodeURIComponent(params)}` 
  } else {
   return `http://localhost:4000/data/authors/all`
  } 
}

// watcher sagas
export function* loadDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { pagination } } = yield take(`@@authors/LOAD_DATA`);
    yield fork(loadData, {
      url: buildUrlForLoadData(pagination),
      currentPage: pagination.current,
      needDelay: false,
      payloadFunc: getSuccessPayload,
    });
   
  }
}

export function* searchDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  let task
  while (true) {
    const { payload: { value } } = yield take(`@@authors/SEARCH_DATA`);
    if (task) {
      yield cancel(task)
    }
    task = yield fork(searchData, {
      searchString: value,
      currentPage: 1,
      needDelay: true,
      payloadFunc: getSuccessPayload,
    });
    
  }
}

export function* removeDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { _id } } = yield take(`@@authors/REMOVE_DATA`);
    yield fork(removeData, {
      _id,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* addDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { name, surname, dob, dod } } = yield take(`@@authors/ADD_DATA`);
    yield fork(addData, {
      name,
      surname,
      dob,
      dod,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* editDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { _id, name, surname, dod, dob } } = yield take(`@@authors/EDIT_DATA`);
    yield fork(editData, {
      _id,
      name,
      surname, 
      dod,
      dob,
      payloadFunc: getSuccessPayload,
    });
  }
}

const updatePaginationIfNeeded = (pagination: Pagination, total: number): Pagination => {
  const {
    pageSize,
    current
  } = pagination;
  //debugger
  if (total <= pageSize * (current - 1)) {
    return {
      pageSize,
      current: Math.ceil(total / pageSize),
      total,
    }
  }
  return pagination
}


function* searchAuthors(params: LoadDataProps): IterableIterator<any> {
  const {
    prefix,
    searchString,
    needDelay,
    payloadFunc,
  } = params;

  try {
    if (needDelay) {
      yield call(delay, 500);
    }

    const docs = yield call(Api.searchAuthor, searchString);

    yield put({
      type: `${prefix}/LOAD_DATA_SUCCESS`,
      payload: {        
        data: payloadFunc(docs.data.docs),

      },
    })
  } catch (error) {
    yield put({
      type: `${prefix}/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
  }
}

export function* searchAuthorsSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  let task
  while (true) {
    const { payload: { value } } = yield take(`${prefix}/${TableActions.SEARCH_DATA}`);
    if (task) {
      yield cancel(task)
    }
    task = yield fork(searchAuthors, {
      prefix,
      searchString: value,
      currentPage: 1,
      needDelay: true,
      payloadFunc: getSuccessPayload,
    });
    
  }
}