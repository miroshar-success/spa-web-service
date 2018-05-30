import * as React from 'react';
import { Input, Button } from 'antd';

export interface AddNewFetchExploreState {
  fetchInput: string;
}

export interface AddNewFetchExploreProps {
  fetchSamplesReceived: boolean;
  addNewFetchUrlForExplore: (fetchUrl: string) => any;
}

export default class AddNewFetchExplore extends React.Component<AddNewFetchExploreProps, AddNewFetchExploreState> {

  state: AddNewFetchExploreState = {
    fetchInput: ''
  }

  handleAdd = () => {
    this.props.addNewFetchUrlForExplore(this.state.fetchInput);
    this.setState({ fetchInput: '' });
  }

  handleChange = (event: any) => {
    this.setState({
      fetchInput: event.target.value,
    })
  }

  render() {
    const {
      fetchSamplesReceived,
    } = this.props;

    return (
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <Input
          placeholder='Enter fetch url for explore'
          disabled={!fetchSamplesReceived}
          value={this.state.fetchInput}
          style={{ width: 400, borderRadius: 0 }}
          onChange={this.handleChange}
        />
        <Button
          type='primary'
          disabled={!fetchSamplesReceived}
          style={{ borderRadius: 0 }}
          onClick={this.handleAdd}
        >
          ADD
        </Button>
      </div>
    )
  }
}