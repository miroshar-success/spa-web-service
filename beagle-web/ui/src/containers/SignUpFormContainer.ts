import { connect } from 'react-redux';
import SignUpForm from '../components/SignUpForm/SignUpForm';
import {
  getLoadingStatus,
  getErrorMessage,
} from '@redux/auth/reducer';
import { signUp } from '@redux/auth/actions';
import { RootState } from '@redux/rootReducer';

const mapStateToProps = (state: RootState) => ({
  error: getErrorMessage(state),
  loading: getLoadingStatus(state),
})

export default connect(mapStateToProps, { signUp })(SignUpForm);