import axios from 'axios'

export const fetchData = (url: string) => {
  return axios.get(url)
    .then(response => response.data)
    .catch(error => error)
}

export const removeData = (id: string, searchString: string) => {
  return axios.delete(`/data/fetchs/${id}`, {
    params: {
      searchString,
    }
  })
}