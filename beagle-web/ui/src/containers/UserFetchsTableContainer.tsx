import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadUserFetchs, addNewFetchUrlForExplore, watchFetch, removeFetch } from '@redux/userFetchs/actions';
import {
  getUserFetchs, getFetchSampleUrls, getResultUrls, getLoadingStatus,
} from '@redux/userFetchs/reducer';
import UserFetchsTable from '@components/UserFetchsTable/UserFetchsTable';
import { getUserDetails } from '@redux/auth/reducer';


const mapStateToProps = (state: RootState) => ({
  userDetails: getUserDetails(state),
  fetches: getUserFetchs(state),
  sampleUrls: getFetchSampleUrls(state),
  resultUrls: getResultUrls(state),
  loading: getLoadingStatus(state),
})

export default connect(mapStateToProps, { loadUserFetchs, addNewFetchUrlForExplore, watchFetch, removeFetch })(UserFetchsTable);