import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadFetchs, searchFetch, removeFetch } from '@redux/fetch/actions';
import {
  getData,
  getPagination,
  getLoadingStatus,
  getError,
} from '@redux/common/table/reducer';
import { TableReducerNameSubscribers } from '@redux/common/table/types';
import FilterableFetchTable from '@components/FetchTable/FilterableFetchTable';

const prefix = TableReducerNameSubscribers.FETCHS;

const mapStateToProps = (state: RootState) => ({
  fetchs: getData(state, prefix),
  pagination: getPagination(state, prefix),
  loading: getLoadingStatus(state, prefix),
  error: getError(state, prefix),
})

export default connect(mapStateToProps, { loadFetchs, searchFetch, removeFetch })(FilterableFetchTable);