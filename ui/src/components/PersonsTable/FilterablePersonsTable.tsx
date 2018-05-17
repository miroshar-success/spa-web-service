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
}

export interface SearchPersonsBarProps {
  searchPerson: (value: string) => any;
}

type FilterablePersonsTableProps = PersonsTableProps & SearchPersonsBarProps;

export default class FilterablePersonsTable extends React.Component<FilterablePersonsTableProps> {

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