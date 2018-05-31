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
  readonly fetches: Array<UserFetch>;
  readonly sampleUrls: any;
  readonly resultUrls: any,
  readonly loading: boolean;
}

// models

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

export interface UserFetchResults {
  fetchUrl: string,
}

export interface UserFetchSamples extends UserFetch { }