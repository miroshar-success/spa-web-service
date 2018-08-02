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

export var sortData = (field: string, order: string, genre: string, startCost: number, endCost: number) => {

  var sortRequest: string = "data/books/common-sort?";
  
  if( field != "" && order != "" ) 
    sortRequest = sortRequest + "field=" + field + "&order=" + order;
    
  if( genre.length > 0 )
    sortRequest = sortRequest + "&genre=" + genre;

  if( startCost >= 0)
    sortRequest = sortRequest + "&startCost=" + startCost;

  if( endCost <= Number.MAX_VALUE)
    sortRequest = sortRequest + "&endCost=" + endCost;

  debugger
  console.log(genre, startCost, endCost);
  console.log(sortRequest)
  return axios.get(sortRequest);

}



/*
sortData = (field: string, order: string) => {
  return axios.get(`data/books/sort?field=${field}&order=${order}`); 
}

sortData = (genre: string) => {
  return axios.get(`data/books/sort?&genre=${genre}`); 
}

sortData = (startCost: number, endCost: number) => {
  return axios.get(`data/books/sort?startCost=${startCost}&endCost=${endCost}`);
}*/