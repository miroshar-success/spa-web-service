import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import { RootState } from '@redux/rootReducer';
import { getUserDetails } from '@redux/auth/reducer';
import { Roles } from '@redux/auth/types';

export interface LinkItemProps {
  path: string;
  title: string;
}

const LinkItem = ({ path, title }: LinkItemProps) => (
  <React.Fragment>
    <li><Link to={path}>{title}</Link></li>
    <Divider type='vertical' style={{ marginTop: 5 }} />
  </React.Fragment>
)

const renderUserNavigation = () => (
  <React.Fragment>
    <LinkItem path='/' title='Home' />
    <LinkItem path='/fetchs' title='Fetchs' />
  </React.Fragment>
)

const renderAdminNavigation = () => (
  <React.Fragment>
    <LinkItem path='/' title='Home' />
    <LinkItem path='/a_persons' title='Persons' />
    <LinkItem path='/a_fetchs' title='Fetchs' />
  </React.Fragment>
)


const Navigation = (props: any) => {
  const {
    userDetails: {
      // name,
      role,
      authorized,
    }
  } = props;
  return (
    <ul style={{ display: 'flex', listStyle: 'none' }}>
      {
        authorized
          ? role === Roles.ADMIN
            ? renderAdminNavigation()
            : renderUserNavigation()
          : null
      }
    </ul>
  )
}

const mapStateToProps = (state: RootState) => ({
  userDetails: getUserDetails(state)
})

export default connect(mapStateToProps)(Navigation);