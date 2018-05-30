import * as React from 'react';
import { Input, Button, Modal } from 'antd';

export interface WatchFetchModalProps {
  open: boolean,
  onOk: Function,
  onCancel: Function,
}

export default class WatchFetchModal extends React.Component<WatchFetchModalProps> {

  state = {
    inputValue: '',
  }

  handleSubmit = () => {
    this.props.onOk(this.state.inputValue);
  }

  onCancel = () => {
    this.props.onCancel();
  }

  handleChange = (event: any) => {
    this.setState({
      inputValue: event.target.value
    })
  }

  render() {
    return (
      <Modal
        title='Watch fetch'
        footer={null}
        onCancel={this.onCancel}
        visible={this.props.open}
      >
        <Input placeholder='Enter fetch sample url' style={{ marginBottom: 20 }} onChange={this.handleChange} />
        <Button type='primary' onClick={this.handleSubmit}>OK</Button>
      </Modal>
    )
  }
}