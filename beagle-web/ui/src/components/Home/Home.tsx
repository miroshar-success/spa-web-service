import * as React from 'react';

export default () => <h1>Home</h1>

// import { TokenManager } from '../ProtectedRoute/ProtectedRoute';
// import axios from 'axios';
// export default class Home extends React.Component {

//   componentDidMount() {
//     axios.get('/beagle-web/test', {
//       headers: {
//         Authorization: `Bearer ${TokenManager.getToken()}`
//       }
//     })
//       .then(response => console.log(response))
//       .catch(error => console.log(error))
//   }

//   render() {
//     return (
//       <h1>Home</h1>
//     )
//   }
// }