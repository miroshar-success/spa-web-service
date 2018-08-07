import { take, call, put, fork, cancel} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { 
  TableActions, 
  Pagination, 
  LoadDataProps, 
  //RemoveDataProps, 
 // AddDataProps, 
 // EditDataProps,
  } from '@redux/common/table/types';
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

// function* removeData(params: RemoveDataProps): IterableIterator<any> {
//   const {
//     prefix,
//     _id,
//     payloadFunc,
//   } = params;

//   try {
//     const searchString = yield select(getSearchString, prefix);
//     const { data } = yield call(Api.removeAuthor, _id, searchString);
//     const pagination = yield select(getPagination, prefix);
//     const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
//     yield fork(loadData, {
//       prefix,
//       url: buildUrlForLoadData(newPagination),
//       currentPage: newPagination.current,
//       needDelay: false,
//       payloadFunc,
//     })
//   } catch (error) {
//     console.log(error)
//     yield put({
//       type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
//       payload: {
//         error: error.message,
//       }
//     })
//   }
// }

// function* addData(params: AddDataProps): IterableIterator<any> {
//   const {
//     prefix,
//     name,
//     author,
//     cost,
//     genre,
//     payloadFunc,
//   } = params;

//   try {
    
//     const { data } = yield call(Api.addBooks, name, author, cost, genre);
//     const pagination = yield select(getPagination, prefix);
//     const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
//     yield fork(loadData, {
//       prefix,
//       url: buildUrlForLoadData(newPagination),
//       currentPage: newPagination.current,
//       needDelay: false,
//       payloadFunc,
//     })
//   } catch (error) {
//     console.log(error)
//     yield put({
//       type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
//       payload: {
//         error: error.message,
//       }
//     })
//   }
// }

// function* editData(params: EditDataProps): IterableIterator<any> {
//   const {
//     prefix,
//     _id,
//     name,
//     author,
//     cost,
//     genre,
//     payloadFunc,
//   } = params;

//   try {    
//     const { data } = yield call(Api.editBooks, _id, name, author, cost, genre);
//     const pagination = yield select(getPagination, prefix);
//     const newPagination = updatePaginationIfNeeded(pagination, typeof data === 'object' ? data.total : data)
//     yield fork(loadData, {
//       prefix,
//       url: buildUrlForLoadData(newPagination),
//       currentPage: newPagination.current,
//       needDelay: false,
//       payloadFunc,
//     })
//   } catch (error) {
//     console.log(error)
//     yield put({
//       type: `${prefix}/${TableActions.LOAD_DATA_FAILURE}`,
//       payload: {
//         error: error.message,
//       }
//     })
//   }
// }

// helpers
const buildUrlForLoadData = (params: Pagination | string): string => {
 // const fullPrefix = `data/${prefix.slice(2)}`;
  
  if (typeof params === 'string') {
    console.log(params)
    return `http://localhost:4000/data/authors/find?search=${encodeURIComponent(params)}`
    
  } else {
    //const { pageSize, current } = params;
   // return `${fullPrefix}?value=&offset=${current > 1 ? pageSize * (current - 1) : 0}&limit=${pageSize}`
   console.log(params)
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

// export function* removeDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
//   while (true) {
//     const { payload: { _id } } = yield take(`${prefix}/${TableActions.REMOVE_DATA}`);
//     yield fork(removeData, {
//       prefix,
//       _id,
//       payloadFunc: getSuccessPayload,
//     });
//   }
// }

// export function* addDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
//   while (true) {
//     const { payload: { name, author, cost, genre } } = yield take(`${prefix}/${TableActions.ADD_DATA}`);
//     yield fork(addData, {
//       prefix,
//       name,
//       author,
//       cost,
//       genre,
//       payloadFunc: getSuccessPayload,
//     });
//   }
// }

// export function* editDataSaga(prefix: string, getSuccessPayload: Function): IterableIterator<any> {
//   while (true) {
//     const { payload: { _id, name, author, cost, genre } } = yield take(`${prefix}/${TableActions.EDIT_DATA}`);
//     yield fork(editData, {
//       prefix,
//       _id,
//       name,
//       author,
//       cost,
//       genre,
//       payloadFunc: getSuccessPayload,
//     });
//   }
// }

// const updatePaginationIfNeeded = (pagination: Pagination, total: number): Pagination => {
//   const {
//     pageSize,
//     current
//   } = pagination;
//   //debugger
//   if (total <= pageSize * (current - 1)) {
//     return {
//       pageSize,
//       current: Math.ceil(total / pageSize),
//       total,
//     }
//   }
//   return pagination
// }


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