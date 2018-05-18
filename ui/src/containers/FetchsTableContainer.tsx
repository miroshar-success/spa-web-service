import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadFetchs, searchFetch, removeFetch } from '@redux/fetch/actions';
import {
  getFetchs,
  getPagination,
  getLoadingStatus,
  getError,
} from '@redux/fetch/reducer';

import FilterableFetchTable from '../components/FetchTable/FilterableFetchTable';

const mapStateToProps = (state: RootState) => ({
  fetchs: getFetchs(state),
  pagination: getPagination(state),
  loading: getLoadingStatus(state),
  error: getError(state),
})

export default connect(mapStateToProps, { loadFetchs, searchFetch, removeFetch })(FilterableFetchTable);