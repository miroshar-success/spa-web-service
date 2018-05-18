import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadPersons, searchPerson } from '@redux/persons/actions';
import {
  getPersons,
  getPagination,
  getLoadingStatus,
  getError,
} from '@redux/persons/reducer';

import FilterablePersonsTable from '../components/PersonsTable/FilterablePersonsTable';

const mapStateToProps = (state: RootState) => ({
  persons: getPersons(state),
  pagination: getPagination(state),
  loading: getLoadingStatus(state),
  error: getError(state),
})

export default connect(mapStateToProps, { loadPersons, searchPerson })(FilterablePersonsTable);