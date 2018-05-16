import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadPersons } from '@redux/persons/actions';
import {
  getPersons,
  getPagination,
  getLoadingStatus,
  getError,
} from '@redux/persons/reducer';

import PersonsTable from '../components/PersonsTable/PersonsTable';

const mapStateToProps = (state: RootState) => ({
  persons: getPersons(state),
  pagination: getPagination(state),
  loading: getLoadingStatus(state),
  error: getError(state),
})

export default connect(mapStateToProps, { loadPersons })(PersonsTable);