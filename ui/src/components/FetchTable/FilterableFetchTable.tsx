import * as React from 'react';
import FetchTable from './FetchTable';
import SearchBar from '@components/common/SearchBar/SearchBar';
import { Fetch } from '@redux/fetch/types';
import { Pagination } from '@redux/common/table/types';

export interface FetchTableProps {
  fetchs: Array<Fetch>;
  pagination: Pagination;
  loading: boolean;
  error: string;
  loadFetchs: (pagination: Pagination) => any;
  removeFetch: (personKey: string) => any;
}

export interface SearchBarProps {
  [functionName: string]: (value: string) => any;
}

type FilterablePersonsTableProps = FetchTableProps & SearchBarProps;

export default class FilterableFetchTable extends React.Component<FilterablePersonsTableProps> {

  render() {
    const {
      fetchs,
      pagination,
      loading,
      error,
      loadFetchs,
      searchFetch,
      removeFetch,
    } = this.props

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <SearchBar onSearch={searchFetch} />
        <FetchTable
          fetchs={fetchs}
          pagination={pagination}
          loading={loading}
          error={error}
          loadFetchs={loadFetchs}
          removeFetch={removeFetch}
        />
      </div>
    )
  }
}