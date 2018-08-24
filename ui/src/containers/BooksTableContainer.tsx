import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadBooks, searchBook, removeBook, addBook,  editBook, sortBook
} from '@redux/books/actions';
import {
  getData,
  getPagination,
  getLoadingStatus,
  getError,
} from '@redux/books/reducer';
import FilterableBooksTable from '@components/Book/BookTable/FilterableBooksTable';


const mapStateToProps = (state: RootState) => ({
  books: getData(state),
  pagination: getPagination(state),
  loading: getLoadingStatus(state),
  error: getError(state),
  
})

export default connect(mapStateToProps, { loadBooks, searchBook, removeBook, addBook,  editBook, sortBook, 
})(FilterableBooksTable);