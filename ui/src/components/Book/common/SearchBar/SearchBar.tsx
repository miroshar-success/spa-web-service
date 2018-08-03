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
      <div style={{ width: 220, 
                    marginBottom: "20px", 
                    marginLeft: "20px", 
                    flexDirection: 'column' }}>
        <Search onChange={this.handleChange} 
        placeholder="Search..."
        />
      </div>
    )
  }
}