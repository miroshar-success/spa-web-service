import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadAuthors, searchAuthors, removeAuthor, addAuthors, editAuthor
} from '@redux/authors/actions';
import {
  getData,
  getLoadingStatus,
  getPagination,
  getError,
} from '@redux/authors/reducer';
import FilterableAuthorsTable from '@components/Author/AuthorTable/FilterableAuthorsTable';


const mapStateToProps = (state: RootState) => ({
  authors: getData(state),
  loading: getLoadingStatus(state),
  pagination: getPagination(state),
  error: getError(state),
})

export default connect(mapStateToProps, { loadAuthors, searchAuthors, removeAuthor, addAuthors, editAuthor
})(FilterableAuthorsTable);