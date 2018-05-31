import { connect } from 'react-redux';
import SignInForm from '@components/SignInForm/SignInForm';
import { signIn } from '@redux/auth/actions';
import {
  getLoadingStatus,
  getErrorMessage,
} from '@redux/auth/reducer';
import { RootState } from '@redux/rootReducer';

const mapStateToProps = (state: RootState) => ({
  error: getErrorMessage(state),
  loading: getLoadingStatus(state),
})

export default connect(mapStateToProps, { signIn })(SignInForm);