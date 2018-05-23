import { connect } from 'react-redux';
import SignUpForm from '../components/SignUpForm/SignUpForm';
import { signUp } from '@redux/auth/actions';

export default connect(null, { signUp })(SignUpForm);