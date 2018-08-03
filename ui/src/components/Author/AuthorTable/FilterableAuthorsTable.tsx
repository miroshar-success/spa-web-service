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
    
    loadAuthors: () => object; 
    removeAuthor: (_id: string) => object; 
    editAuthor: (_id: string, name: string, surname: string, lifetime: Date) => object;        
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
        loadAuthors,
        searchAuthors,
        removeAuthor,
        addAuthor,
        editAuthor,                 
      } = this.props
  
      return (        
          <div>
              <Row>
                <Col span={8}>
                  <SearchBar               
                    onSearch={searchAuthors}/>
                  <AuthorForm
                    addAuthor={addAuthor}
                    />
                </Col>
                <Col span={16}>
                  <AuthorTable        
                    authors={authors}
                    loading={loading}
                    error={error}
                    loadAuthors={loadAuthors}            
                    removeAuthor={removeAuthor}
                    editAuthor={editAuthor}               
                  />
                </Col>                
              </Row>
          </div>        
      )
    }
  } 

