import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { getCounterValue } from '../redux/counter/reducer';
import { RootState } from '../redux/rootReducer';
import {
  increment,
  decrement,
} from '../redux/counter/actions';

import { Counter } from '../components/counter/Counter';

const mapStateToProps = (state: RootState) => ({
  value: getCounterValue(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    increment,
    decrement,
  }, dispatch)
})

// or use

//export default connect(mapStateToProps, { increment, decrement })(Counter);

export default connect(mapStateToProps, mapDispatchToProps)(Counter);