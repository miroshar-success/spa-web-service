import axios from 'axios';

export const fetchData = (url: string) => {
  return axios.get(url)
    .then(response => response.data)
    .catch(error => error)
}

export const removeData = (_id: string) => {
  return axios.delete(`/data/books/remove?_id=${_id}`);
}

export const addData = (name: string, author: string, cost: number, genre: string) => {    
  return axios.post(`data/books/newbook?genre=${genre}&cost=${cost}&author=${author}&name=${name}`);  
}

export const editData = (_id: string, name: string, author: string, cost: number, genre: string) => {
  return axios.put(`data/books/edit?cost=${cost}&author=${author}&name=${name}&_id=${_id}&genre=${genre}`);
}

export const sortData = (field: string, order: string) => {
  return axios.get(`data/books/sort?order=${order}&field=${field}`); 
}

export const sortData2 = (genre: string) => {
  return axios.get(`data/books/filter-genre?&genre=${genre}`); 
}



