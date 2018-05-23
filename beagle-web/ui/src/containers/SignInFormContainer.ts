import { connect } from 'react-redux';
import SignInForm from '../components/SignInForm/SignInForm';
import { signIn } from '@redux/auth/actions';

export default connect(null, { signIn })(SignInForm);