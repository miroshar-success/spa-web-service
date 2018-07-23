import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadBooks, searchBook, removeBook, addBook, editBook, sortBook, sortBook2 } from '@redux/books/actions';
import {
  getData,
  getPagination,
  getLoadingStatus,
  getError,
} from '@redux/common/table/reducer';
import { TableReducerNameSubscribers } from '@redux/common/table/types';
import FilterableBooksTable from '../components/BookTable/FilterableBooksTable';


const prefix = TableReducerNameSubscribers.BOOKS;

const mapStateToProps = (state: RootState) => ({
  books: getData(state, prefix),
  pagination: getPagination(state, prefix),
  loading: getLoadingStatus(state, prefix),
  error: getError(state, prefix),
})

export default connect(mapStateToProps, { loadBooks, searchBook, removeBook, addBook, editBook, sortBook, sortBook2 })(FilterableBooksTable);