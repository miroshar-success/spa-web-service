import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { loadAuthors, searchAuthor, removeAuthor, addAuthor, editAuthor
} from '@redux/authors/actions';
import {
  getData,
  getLoadingStatus,
  getError,
} from '@redux/common/table/reducer';
import { TableReducerNameSubscribers } from '@redux/common/table/types';
import FilterableAuthorsTable from '@components/Author/AuthorTable/FilterableAuthorsTable';


const prefix = TableReducerNameSubscribers.AUTHORS;

const mapStateToProps = (state: RootState) => ({
  authors: getData(state, prefix),
  loading: getLoadingStatus(state, prefix),
  error: getError(state, prefix),
})

export default connect(mapStateToProps, { loadAuthors, searchAuthor, removeAuthor, addAuthor, editAuthor
})(FilterableAuthorsTable);