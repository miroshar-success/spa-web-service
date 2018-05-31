export enum UserFetchsActions {
  ADD_NEW_FETCH_FOR_EXPLORE = 'ADD_NEW_FETCH_FOR_EXPLORE',
  SAVE_EXPLORED_FETCH_SAMPLES = 'SAVE_EXPLORED_FETCH_SAMPLES',
  SAVE_FETCH_RESULTS = 'SAVE_FETCH_RESULTS',
  WATCH_FETCH = 'WATCH_FETCH',
  REMOVE_FETCH = 'REMOVE_FETCH',
}

// user fetchs state shape

export interface UserFetchsState {
  readonly fetches: Array<FetchSample>;
  readonly sampleUrls: Array<FetchSample>;
  readonly resultUrls: Array<FetchSample>,
  readonly loading: boolean;
}

// models

export interface FetchSample {
  url: string;
  meta: {
    title: string;
    image: string;
  }
}