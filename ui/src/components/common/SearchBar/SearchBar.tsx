import * as React from 'react';
import { Input } from 'antd';

export interface SearchBarProps {
  [functionName: string]: (value: string) => any;
}

export default class SearchBar extends React.PureComponent<SearchBarProps> {

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.search(event.target.value);
  }

  render() {
    return (
      <div style={{ width: 200, margin: '30px 0' }}>
        <Input onChange={this.handleChange} />
      </div>
    )
  }
}