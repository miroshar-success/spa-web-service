import { createAction } from 'typesafe-actions';
import { TableActions } from '@redux/common/table/types';
import { UserFetchsActions } from './types';

export const loadUserFetchs = createAction(`${TableActions.LOAD_DATA}`, resolve => {
  return (personKey: string) => resolve({ personKey })
});

export const loadUserFetchsSuccess = createAction(`${TableActions.LOAD_DATA_SUCCESS}`, resolve => {
  return (fetchs: any[]) => resolve({ fetchs })
})

export const removeData = createAction(`${TableActions.REMOVE_DATA}`, resolve => {
  return (fetchUrl: string) => resolve({ fetchUrl })
});

export const addNewFetchUrlForExplore = createAction(UserFetchsActions.ADD_NEW_FETCH_FOR_EXPLORE, resolve => {
  return (fetchUrl: string) => resolve({ fetchUrl })
})

export const saveExploredFetchSamples = createAction(UserFetchsActions.SAVE_EXPLORED_FETCH_SAMPLES, resolve => {
  return (fetch: any, sampleUrls: any) => resolve({ fetch, sampleUrls })
})

export const saveFetchResults = createAction(UserFetchsActions.SAVE_FETCH_RESULTS, resolve => {
  return (resultUrls: any) => resolve({ resultUrls })
})

export const watchFetch = createAction(UserFetchsActions.WATCH_FETCH, resolve => {
  return (fetchUrl: string, sampleUrl: string) => resolve({ fetchUrl, sampleUrl })
})

export const removeFetch = createAction(UserFetchsActions.REMOVE_FETCH, resolve => {
  return (fetchUrl: string) => resolve({ fetchUrl });
})