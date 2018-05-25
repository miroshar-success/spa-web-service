import * as React from 'react';
import PersonsTable from './PersonsTable';
import SearchBar from '@components/common/SearchBar/SearchBar';
import { Person } from '@redux/persons/types';
import { Pagination } from '@redux/common/table/types';

export interface PersonsTableProps {
  persons: Array<Person>;
  pagination: Pagination;
  loading: boolean;
  error: string;
  loadPersons: (pagination: Pagination) => any;
}

export interface SearchBarProps {
  [functionName: string]: (value: string) => any;
}

type FilterablePersonsTableProps = PersonsTableProps & SearchBarProps;

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
        <SearchBar onSearch={searchPerson} />
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