export enum UserFetchsActions {
  ADD_NEW_FETCH_FOR_EXPLORE = 'ADD_NEW_FETCH_FOR_EXPLORE',
  SAVE_EXPLORED_FETCH_SAMPLES = 'SAVE_EXPLORED_FETCH_SAMPLES',
  SAVE_FETCH_RESULTS = 'SAVE_FETCH_RESULTS',
  WATCH_FETCH = 'WATCH_FETCH',
  REMOVE_FETCH = 'REMOVE_FETCH',
  REMOVE_FETCH_SUCCESS = 'REMOVE_FETCH_SUCCESS',
}

// user fetchs state shape

export interface UserFetchsState {
  readonly fetches: Array<Models.UserFetch>;
  readonly sampleUrls: Models.UserFetchSamples;
  readonly resultUrls: Array<Models.UserFetchResults>,
  readonly loading: boolean;
}

// models

export namespace Models {

  export interface UserFetch {
    key: string,
    url: string;
    meta: {
      title: string;
      image: string;
    }
  }

  export interface ExploredUserFetch extends UserFetch {
    sampleUrls: Array<UserFetch>,
  }

  export interface UserFetchResults extends UserFetch {
    fetchUrl: string,
  }

  export interface UserFetchSamples {
    [key: string]: Array<UserFetch>;
  }

}


// action creators return type signature

export namespace Signatures {

  export type LoadUserFetchs = {
    (personKey: string): object;
  }

  export type AddNewFetchForExplore = {
    (fetchUrl: string): object;
  }

  export type WatchFetch = {
    (fetchUrl: string, sampleUrl: string): object;
  }

  export type RemoveFetch = {
    (fetchUrl: string): object;
  }

}