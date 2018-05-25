import { connect } from 'react-redux';
import SignUpForm from '../components/SignUpForm/SignUpForm';
import {
  getLoadingStatus,
  getError,
} from '@redux/auth/reducer';
import { signUp } from '@redux/auth/actions';
import { RootState } from '@redux/rootReducer';

const mapStateToProps = (state: RootState) => ({
  error: getError(state),
  loading: getLoadingStatus(state),
})

export default connect(mapStateToProps, { signUp })(SignUpForm);