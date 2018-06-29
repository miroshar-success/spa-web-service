import * as React from 'react';
import { Input } from 'antd';

const Search = Input.Search;

export interface SearchBarProps {
  [functionName: string]: (value: string) => any;
}

export default class SearchBar extends React.PureComponent<SearchBarProps> {

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSearch(event.target.value);
  }

  render() {
    return (
      <div style={{ width: 200, margin: '30px 0' }}>
        <Search onChange={this.handleChange} 
        placeholder="Search..."
        />
      </div>
    )
  }
}