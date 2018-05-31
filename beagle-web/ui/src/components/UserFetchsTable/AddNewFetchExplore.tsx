import * as React from 'react';
import { Input, Button } from 'antd';

export interface AddNewFetchExploreState {
  fetchUrl: string;
}

export interface AddNewFetchExploreProps {
  fetchSamplesReceived: boolean;
  addNewFetchUrlForExplore: (fetchUrl: string) => any;
}

export default class AddNewFetchExplore extends React.Component<AddNewFetchExploreProps, AddNewFetchExploreState> {

  readonly state: AddNewFetchExploreState = {
    fetchUrl: '',
  }

  handleAdd = () => {
    this.props.addNewFetchUrlForExplore(this.state.fetchUrl);
    this.setState({ fetchUrl: '' });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ fetchUrl: event.target.value });
  }

  render() {
    const {
      fetchSamplesReceived,
    } = this.props;

    return (
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <Input
          disabled={!fetchSamplesReceived}
          placeholder='Enter fetch url for explore'
          style={{ width: 400, borderRadius: 0 }}
          value={this.state.fetchUrl}
          onChange={this.handleChange}
        />
        <Button
          disabled={!fetchSamplesReceived}
          style={{ borderRadius: 0 }}
          type='primary'
          onClick={this.handleAdd}
        >
          ADD FETCH
        </Button>
      </div>
    )
  }
}