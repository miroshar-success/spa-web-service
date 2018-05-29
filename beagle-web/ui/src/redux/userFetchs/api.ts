import axios from 'axios'

export const fetchData = (url: string, personKey: string) => {
  return axios.post(url, {
    clientName: 'beagleWeb',
    personKey,
    personInfo: null,
  })
    .then(response => response.data)
    .catch(error => error)
}

export const createFetchExplore = (fetchUrl: string, personKey: string) => {
  return axios.post('/fetch/explore', {
    person: {
      clientName: 'beagleWeb',
      personKey,
      personInfo: null,
    },
    fetchUrl,
  })
}

export const createWatchFetch = (fetchUrl: string, sampleUrl: string, personKey: string) => {
  return axios.post('/fetch', {
    person: {
      clientName: 'beagleWeb',
      personKey,
      personInfo: null,
    },
    fetchUrl,
    sampleUrl,
  })
}