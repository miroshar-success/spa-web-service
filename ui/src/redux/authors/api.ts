import axios from 'axios';

export const fetchData = (url: string) => {
  return axios.get(url)
  .then(response => response.data)
  .catch(error => error)
}

export const removeAuthor = (_id: string) => {
    return axios.delete(`/data/authors/remove?_id=${_id}`);
  }
  
  export const searchAuthor = (search: string) => {
    return axios.get(`/data/authors/find?search=${search}`);
  }
  
  export const addAuthor = (name: string, surname: string, dob: Date, dod: Date) => {    
    return axios.post(`data/authors/newAuthor?dob=${dob}&dod=${dod}&surname=${surname}&name=${name}`);  
  }
  
  export const editAuthor = (_id: string, name: string, surname: string, dob: Date, dod: Date) => {
    return axios.put(`data/authors/edit?dod=${dod}&dob=${dob}&surname=${surname}&name=${name}&_id=${_id}`);
  }