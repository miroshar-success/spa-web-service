import * as React from 'react';
import PersonsTable from './PersonsTable';
import SearchPersonsBar from './SearchPersonsBar';
import { Person, Pagination } from '@redux/persons/types';

export interface PersonsTableProps {
  persons: Array<Person>;
  pagination: Pagination;
  loading: boolean;
  error: string;
  loadPersons: (pagination: Pagination) => any;
  searchPerson: (value: string) => any;
}

export default class FilterablePersonsTable extends React.Component<PersonsTableProps> {

  render() {
    const {
      persons,
      pagination,
      loading,
      error,
      loadPersons,
      searchPerson,
    } = this.props

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SearchPersonsBar searchPerson={searchPerson} />
        <PersonsTable
          persons={persons}
          pagination={pagination}
          loading={loading}
          error={error}
          loadPersons={loadPersons}
        />
      </div>
    )
  }
}