import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadPersons, searchPerson } from '@redux/persons/actions';
import {
  getData,
  getPagination,
  getLoadingStatus,
  getError,
} from '@redux/common/table/reducer';
import { TableReducerNameSubscribers } from '@redux/common/table/types';
import FilterablePersonsTable from '../components/PersonsTable/FilterablePersonsTable';

const prefix = TableReducerNameSubscribers.PERSONS;

const mapStateToProps = (state: RootState) => ({
  persons: getData(state, prefix),
  pagination: getPagination(state, prefix),
  loading: getLoadingStatus(state, prefix),
  error: getError(state, prefix),
})

export default connect(mapStateToProps, { loadPersons, searchPerson })(FilterablePersonsTable);