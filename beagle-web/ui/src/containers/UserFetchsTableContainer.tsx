import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadUserFetchs, addNewFetchUrlForExplore, watchFetch } from '@redux/userFetchs/actions';
import {
  getUserFetchs, getFetchSampleUrls, getResultUrls, getLoadingStatus,
} from '@redux/userFetchs/reducer';
import UserFetchsTable from '@components/UserFetchsTable/UserFetchsTable';


const mapStateToProps = (state: RootState) => ({
  fetches: getUserFetchs(state),
  sampleUrls: getFetchSampleUrls(state),
  resultUrls: getResultUrls(state),
  loading: getLoadingStatus(state),
})

export default connect(mapStateToProps, { loadUserFetchs, addNewFetchUrlForExplore, watchFetch })(UserFetchsTable);