import { createAction } from 'typesafe-actions';
import { TableActions } from '@redux/common/table/types';
import { UserFetchsActions, Models, Signatures } from './types';

export const loadUserFetchs: Signatures.LoadUserFetchs = createAction(`${TableActions.LOAD_DATA}`, resolve => {
  return (personKey: string) => resolve({ personKey })
});

export const loadUserFetchsSuccess = createAction(`${TableActions.LOAD_DATA_SUCCESS}`, resolve => {
  return (fetchs: Models.UserFetch[]) => resolve({ fetchs })
})

export const addNewFetchUrlForExplore: Signatures.AddNewFetchForExplore = createAction(UserFetchsActions.ADD_NEW_FETCH_FOR_EXPLORE, resolve => {
  return (fetchUrl: string) => resolve({ fetchUrl })
})

export const saveExploredFetchSamples = createAction(UserFetchsActions.SAVE_EXPLORED_FETCH_SAMPLES, resolve => {
  return (exploredFetchWithSamples: Models.ExploredUserFetch) => resolve({ exploredFetchWithSamples })
})

export const saveFetchResults = createAction(UserFetchsActions.SAVE_FETCH_RESULTS, resolve => {
  return (fetchResults: Models.UserFetchResults[]) => resolve({ fetchResults })
})

export const watchFetch: Signatures.WatchFetch = createAction(UserFetchsActions.WATCH_FETCH, resolve => {
  return (fetchUrl: string, sampleUrl: string) => resolve({ fetchUrl, sampleUrl })
})

export const removeFetch: Signatures.RemoveFetch = createAction(UserFetchsActions.REMOVE_FETCH, resolve => {
  return (fetchUrl: string) => resolve({ fetchUrl });
})

export const removeFetchSuccess = createAction(UserFetchsActions.REMOVE_FETCH_SUCCESS, resolve => {
  return () => resolve();
})