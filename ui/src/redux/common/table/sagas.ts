import { take, call, put, fork, cancel, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { 
  TableActions, 
  Pagination, 
  LoadDataProps, 
  RemoveDataProps, 
  AddDataProps, 
  EditDataProps,
  SortDataProps
  } from './types';
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
    console.log(error)
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* sortData(params: SortDataProps): IterableIterator<any> {
  const {
    prefix,    
    field,
    order,
    payloadFunc
  } = params;

  try {    
    const { data } = yield call(Api.sortData, field, order);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, data)
      
    //debugger
    yield put({
      type: `${prefix}/${TableActions.SORT_DATA_SUCCESS}`,            
      payload: {
        data: payloadFunc(data),
        currentPage: newPagination.current,       
        
        needDelay: false,        
      },
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* sortBookByCost(params: SortDataProps): IterableIterator<any> {
  const {
    prefix,    
    minValue,
    maxValue,
    payloadFunc
  } = params;

  try {
    
    const { data } = yield call(Api.sortCost, minValue, maxValue);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_SUCCESS}`,
      prefix,
      payload: {
        data: payloadFunc(data),
        currentPage: newPagination.current,
        needDelay: false,
        payloadFunc,
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

function* genreSort(params: SortDataProps): IterableIterator<any> {
  const {
    prefix,
    genre,
    payloadFunc,
  } = params;

  try {    
    const { data } = yield call(Api.sortData2, genre);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)

    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_SUCCESS}`,
      prefix,
      payload: {
        data: payloadFunc(data),
        currentPage: newPagination.current,
        needDelay: false,
        payloadFunc,
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
    _id,
    payloadFunc,
  } = params;

  try {
    const searchString = yield select(getSearchString, prefix);
    const { data } = yield call(Api.removeData, _id, searchString);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(newPagination, prefix),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* addData(params: AddDataProps): IterableIterator<any> {
  const {
    prefix,
    name,
    author,
    cost,
    genre,
    payloadFunc,
  } = params;

  try {
    
    const { data } = yield call(Api.addData, name, author, cost, genre);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(newPagination, prefix),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
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
    author,
    cost,
    genre,
    payloadFunc,
  } = params;

  try {    
    const { data } = yield call(Api.editData, _id, name, author, cost, genre);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(newPagination, prefix),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
      payload: {
        error: error.message,
      }
    })
  }
}

// helpers
const buildUrlForLoadData = (params: Pagination | string, prefix: string): string => {
  const fullPrefix = `data/${prefix.slice(2)}`;
  
  if (typeof params === 'string') {
    return `${fullPrefix}/find?search=${encodeURIComponent(params)}`
  } else {
    const { pageSize, current } = params;
    return `${fullPrefix}?value=&offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
  } 
}

// watcher sagas
export function* loadDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { pagination } } = yield take(`${prefix}/${TableActions.LOAD_DATA}`);
    //debugger
    yield fork(loadData, {
      prefix,
      url: buildUrlForLoadData(pagination, prefix),
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
    const { payload: { _id } } = yield take(`${prefix}/${TableActions.REMOVE_DATA}`);
    yield fork(removeData, {
      prefix,
      _id,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* sortDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    //debugger
    const { payload: { field, order } } = yield take(`${prefix}/${TableActions.SORT_DATA}`);
    yield fork(sortData, {
      prefix,
      field,
      order,      
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* sortBookByCostSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { minValue, maxValue } } = yield take(`${prefix}/${TableActions.COST_SORT}`);
    yield fork(sortBookByCost, {
      prefix,
      minValue,
      maxValue,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* addDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { name, author, cost, genre } } = yield take(`${prefix}/${TableActions.ADD_DATA}`);
    yield fork(addData, {
      prefix,
      name,
      author,
      cost,
      genre,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* genreSortSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { genre } } = yield take(`${prefix}/${TableActions.GENRE_SORT}`);
    yield fork(genreSort, {
      prefix,
      genre,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* editDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { _id, name, author, cost, genre } } = yield take(`${prefix}/${TableActions.EDIT_DATA}`);
    yield fork(editData, {
      prefix,
      _id,
      name,
      author,
      cost,
      genre,
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