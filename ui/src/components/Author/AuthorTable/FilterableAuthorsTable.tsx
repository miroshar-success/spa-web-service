import * as React from 'react';
import AuthorTable from '@components/Author/AuthorTable/AuthorTable';
import AuthorForm from '@components/Author/Form/AuthorForm';
import SearchBar from '@components/common/SearchBar/SearchBar';
import { Pagination } from '@redux/common/table/types';
import { Author } from '@redux/authors/types';



import { Row, Col } from 'antd';
export interface AuthorsTableProps {
    readonly authors: Array<Author>;
    readonly loading: boolean;
    readonly error: string; 
    readonly pagination: Pagination;  
    
    loadAuthors: (pagination: Pagination) => object; 
    removeAuthor: (_id: string, pagination: Pagination) => object; 
    editAuthor: (_id: string, name: string, surname: string, dob: string, dod: string) => object;        
  }

  export interface SearchBarProps {
    [functionName: string]: (value: string) => any;
  }

  export interface AuthorFormProps {
    //readonly pagination: Pagination;
    addAuthor: (name: string, surname: string, dob: string, dod: string) => object;
  }

  type FilterableAuthorsTableProps = AuthorsTableProps & SearchBarProps & AuthorFormProps;

 
  export default class FilterableAuthorsTable extends React.Component<FilterableAuthorsTableProps> {

    render() {
      const {
        authors, 
        loading,
        error,
        loadAuthors,
        searchAuthors,
        removeAuthor,
        addAuthor,
        pagination,
        editAuthor,                 
      } = this.props
  
      return (        
          <div>
              <Row>
                <Col span={8}>
                  <SearchBar               
                    onSearch={searchAuthors}/>
                  <AuthorForm
                    ///pagination={pagination}
                    addAuthor={addAuthor}
                    />
                </Col>
                <Col span={16}>
                
                  <AuthorTable        
                    authors={authors}
                    loading={loading}
                    error={error}
                    pagination={pagination}
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

