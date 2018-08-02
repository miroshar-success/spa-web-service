import * as React from 'react';
import BookTable from './BookTable';
import SearchBar from '@components/common/SearchBar/SearchBar';
import { Pagination } from '@redux/common/table/types';
import { Book } from '@redux/books/types';
import BookForm from '../Form/BookForm';
import { Row, Col } from 'antd';

export interface BooksTableProps {
    readonly books: Array<Book>;
    readonly pagination: Pagination;
    readonly loading: boolean;
    readonly error: string;   
    
    loadBooks: (pagination: Pagination) => object; 
    removeBook: (_id: string, pagination: Pagination) => object; 
    editBook: (_id: string, name: string, author: string, cost: number, genre: string) => object;        
    //sortBook2: (genre: string, pagination: Pagination) => object;    // genre
    sortBook: (field: string, order: string, genre: string, minValue: number, maxValue: number, pagination: Pagination) => object;
    //sortAllBooksByCost: (minValue: number, maxValue: number, pagination: Pagination) => object;
  }

  export interface SearchBarProps {
    [functionName: string]: (value: string) => any;
  }

  export interface BookFormProps {
    readonly pagination: Pagination;
    addBook: (name: string, author: string, cost: number, genre: string, pagination: Pagination) => object;
  }

  type FilterableBooksTableProps = BooksTableProps & SearchBarProps & BookFormProps;

  export default class FilterableBooksTable extends React.Component<FilterableBooksTableProps> {

    render() {
      const {
        books,
        pagination,
        loading,
        error,
        loadBooks,
        searchBook,
        removeBook,
        addBook,
        editBook,
        sortBook,
        // sortBook2,  
        // sortAllBooksByCost                  
      } = this.props
  
      return (        
          <div>
              <Row>
                <Col span={8}>
                  <SearchBar               
                    onSearch={searchBook} />
                  <BookForm
                    addBook={addBook}
                    pagination={pagination} 
                    />
                </Col>
                <Col span={16}>
                  <BookTable 
                    //sortAllBooksByCost={sortAllBooksByCost}   
                    sortBook={sortBook}           
                    books={books}
                    pagination={pagination}
                    loading={loading}
                    error={error}
                    loadBooks={loadBooks}            
                    removeBook={removeBook}
                    editBook={editBook}  
                    //sortBook2={sortBook2}            
                  />
                </Col>                
              </Row>
          </div>        
      )
    }
  } 

