import * as React from 'react';

export interface DropdownProps {
  error: Error | null | undefined;
  stackTrace: Array<string> | null;
}

export interface DropdownState {
  readonly open: boolean;
}

/*
  UI component - children of ErrorBoundary.
*/
export default class Dropdown extends React.Component<DropdownProps, DropdownState> {

  readonly state: DropdownState = {
    open: false,
  };

  // Toogle dropdown
  onTitleClick = () => {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }

  render() {
    const {
      error,
      stackTrace,
    } = this.props;

    return (
      <div className='ErrorBoundary-dropdown'>
        <div
          className='ErrorBoundary-dropdown-header'
          onClick={this.onTitleClick}
        >
          {error && error.toString()}
        </div>
        {
          this.state.open && (
            <div className='ErrorBoundary-dropdown-content'>
              {stackTrace && stackTrace.map((item: string, index: number) =>
                <div key={index}>{item}</div>
              )}
            </div>
          )
        }
      </div>
    )
  }
}