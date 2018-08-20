import axios from 'axios';

export const fetchData = (url: string) => {
  return axios.get(url)
  .then(response => response.data)
  .catch(error => error)
}

export const removeBooks = (_id: string) => {
  return axios.delete(`/data/books/remove?_id=${_id}`);
}

export const searchBooks = (search: string) => {
  return axios.get(`/data/books/find?search=${search}`);
}

<<<<<<< HEAD
export const addBooks = (name: string, author: string, cost: number, genre: string,) => {    
  return axios.post(`data/books/newbook?genre=${genre}&cost=${cost}&author=${author}&name=${name}`)
  .then(response => {
    console.log(response);
  })  
=======
export const addBooks = (name: string, author: string, cost: number, genre: string) => {    
  return axios.post(`data/books/newbook?genre=${genre}&cost=${cost}&author=${author}&name=${name}`).then(response => console.log(response), error => {return error});  
>>>>>>> 9ba9662dc0cc305cdcb69440c8621e7bbebcf17c
}

export const editBooks = (_id: string, name: string, author: string, cost: number, genre: string) => {
  return axios.put(`data/books/edit?cost=${cost}&author=${author}&name=${name}&_id=${_id}&genre=${genre}`);
}

export var sortBooks = (field: string, order: string, genre: string, startCost: number, endCost: number) => {

  var sortRequest: string = "data/books/common-sort?";
  
  if( field != "" && order != "") {
    sortRequest = sortRequest + "field=" + field + "&order=" + order;
  }  
  if( genre.length > 0 ) {
    sortRequest = sortRequest + "&genre=" + genre;
  }  
  if( startCost >= 0) {
    sortRequest = sortRequest + "&startCost=" + startCost;
  }
  if( endCost <= Number.MAX_VALUE) {
    sortRequest = sortRequest + "&endCost=" + endCost;
  }
  return axios.get(sortRequest);
}