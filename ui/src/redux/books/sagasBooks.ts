import { take, call, put, fork, cancel, select } from 'redux-saga/effects';
import {message} from 'antd'; 
import { delay } from 'redux-saga';
import { 
  Pagination, 
  LoadDataProps, 
  RemoveDataProps, 
  AddDataProps, 
  EditDataProps,
  SortDataProps
  } from '@redux/common/table/types';
import { getSearchString, getPagination } from '@redux/books/reducer';
import * as Api from '@redux/books/api';

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
      type: `@@books/LOAD_DATA_SUCCESS`,
      payload: {        
        data: payloadFunc(docs),
        
        //pagination: {
         // current: currentPage,
         // total,
        //}
      },
    })
    console.log("try clause load data")
  } catch (error) {
    yield put({
      type: `@@books/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
    console.log("catch clause load data")
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

    const docs = yield call(Api.searchBooks, searchString);

    yield put({
      type: `@@books/LOAD_DATA_SUCCESS`,
      payload: {        
        data: payloadFunc(docs.data.docs),
        
 
      },
    })
  } catch (error) {
    yield put({
      type: `@@books/LOAD_DATA_FAILURE`,
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
    genre,
    minValue,
    maxValue,
    payloadFunc
  } = params;

  try {    
    const { data } = yield call(Api.sortBooks, field, order, genre, minValue, maxValue);
    const pagination = yield select(getPagination, prefix);
    const newPagination = updatePaginationIfNeeded(pagination, data)
      
    //debugger
    yield put({
      type: `@@books/SORT_DATA_SUCCESS`,            
      payload: {
        data: payloadFunc(data),
        currentPage: newPagination.current,       
        needDelay: false,        
      },
    })
  } catch (error) {
    //console.log(error)
    yield put({
      type: `@@books/LOAD_DATA_FAILURE`,
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
    const { data } = yield call(Api.removeBooks, _id, searchString);
    const pagination = yield select(getPagination);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      url: buildUrlForLoadData(newPagination),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    //console.log(error)
    yield put({
      type: `@@books/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
  }
}

function* addData(params: AddDataProps): IterableIterator<any> {
  const {
    name,
    author,
    cost,
    genre,
    payloadFunc,
  } = params;

  try {
    
    const { data } = yield call(Api.addBooks, name, author, cost, genre);
    const pagination = yield select(getPagination);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    message.success("Success");
    yield fork(loadData, {
      url: buildUrlForLoadData(newPagination),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
    console.log("try clause")
  } catch (error) {
    console.log("catch clause")
    message.error(error.message)
     yield put({
       type: `@@books/LOAD_DATA_FAILURE`,
       payload: {
         error: error.message,
       }
     })
  }
}

function* editData(params: EditDataProps): IterableIterator<any> {
  const {
    _id,
    name,
    author,
    cost,
    genre,
    payloadFunc,
  } = params;

  try {    
    const { data } = yield call(Api.editBooks, _id, name, author, cost, genre);
    const pagination = yield select(getPagination);
    const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
    yield fork(loadData, {
      url: buildUrlForLoadData(newPagination),
      currentPage: newPagination.current,
      needDelay: false,
      payloadFunc,
    })
  } catch (error) {
    //console.log(error)
    yield put({
      type: `@@books/LOAD_DATA_FAILURE`,
      payload: {
        error: error.message,
      }
    })
  }
}

// helpers
const buildUrlForLoadData = (params: Pagination | string): string => {
 // const fullPrefix = `data/${prefix.slice(2)}`;
  
  if (typeof params === 'string') { 
    return `http://localhost:4000/data/books/find?search=${encodeURIComponent(params)}`
    
  } else {
    //const { pageSize, current } = params;
   // return `${fullPrefix}?value=&offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
   
   return `http://localhost:4000/data/books/all`
    
  } 
}

// watcher sagas
export function* loadDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { pagination } } = yield take(`@@books/LOAD_DATA`);
    //debugger
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
    const { payload: { value } } = yield take(`@@books/SEARCH_DATA`);
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
    const { payload: { _id } } = yield take(`@@books/REMOVE_DATA`);
    yield fork(removeData, {
      _id,
      payloadFunc: getSuccessPayload,
    });
  }
}

export function* sortDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    //debugger
    const { payload: { field, order, genre, minValue, maxValue } } = yield take(`@@books/SORT_DATA`);
    yield fork(sortData, {
      field,
      order,
      genre,
      minValue,
      maxValue,      
      payloadFunc: getSuccessPayload,
    });
  }
}


export function* addDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { name, author, cost, genre } } = yield take(`@@books/ADD_DATA`);
    yield fork(addData, {
      name,
      author,
      cost,
      genre,
      payloadFunc: getSuccessPayload,
      
    });
  }
}

// export function* addDataFailSaga(): IterableIterator<any> {
  
//   const { payload: { error } } = yield take(`@@books/ADD_DATA_FAILURE`);
//   yield fork(addData, {
//     error
//   });
// }

export function* editDataSaga(getSuccessPayload: Function): IterableIterator<any> {
  while (true) {
    const { payload: { _id, name, author, cost, genre } } = yield take(`@@books/EDIT_DATA`);
    yield fork(editData, {
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

