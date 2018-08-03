import * as React from 'react';
import AuthorTable from '@components/Author/AuthorTable/AuthorTable';
import SearchBar from '@components/Book/common/SearchBar/SearchBar';
import { Author } from '@redux/authors/types';
import AuthorForm from '@components/Author/Form/AuthorForm';
import { Row, Col } from 'antd';

export interface AuthorsTableProps {
    readonly authors: Array<Author>;
    readonly loading: boolean;
    readonly error: string;   
    
    loadBooks: () => object; 
    removeBook: (_id: string) => object; 
    editBook: (_id: string, name: string, author: string, cost: number, genre: string) => object;        
  }

  export interface SearchBarProps {
    [functionName: string]: (value: string) => any;
  }

  export interface AuthorFormProps {
    addAuthor: (name: string, surname: string, lifetime: Date) => object;
  }


  type FilterableBooksTableProps = AuthorsTableProps & SearchBarProps & AuthorFormProps;

  export default class FilterableBooksTable extends React.Component<FilterableBooksTableProps> {

    render() {
      const {
        authors, 
        loading,
        error,
        loadBooks,
        searchBook,
        removeBook,
        addAuthor,
        editBook,                 
      } = this.props
  
      return (        
          <div>
              <Row>
                <Col span={8}>
                  <SearchBar               
                    onSearch={searchBook} />
                  <AuthorForm
                    addAuthor={addAuthor}
                    />
                </Col>
                <Col span={16}>
                  <AuthorTable        
                    authors={authors}
                    loading={loading}
                    error={error}
                    loadBooks={loadBooks}            
                    removeBook={removeBook}
                    editBook={editBook}               
                  />
                </Col>                
              </Row>
          </div>        
      )
    }
  } 

