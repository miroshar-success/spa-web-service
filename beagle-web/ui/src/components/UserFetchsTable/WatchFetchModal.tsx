import * as React from 'react';
import { Input, Button, Modal, Icon } from 'antd';

export interface WatchFetchModalProps {
  fetchUrl: string;
  watchFetch: Function;
}

export interface WatchFetchModalState {
  sampleUrl: string;
  visible: boolean;
}

export default class WatchFetchModal extends React.Component<WatchFetchModalProps, WatchFetchModalState> {

  readonly state: WatchFetchModalState = {
    sampleUrl: '',
    visible: false,
  }

  handleSubmit = () => {
    const {
      fetchUrl,
      watchFetch,
    } = this.props;

    watchFetch(fetchUrl, this.state.sampleUrl);
    this.onCancel();
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ sampleUrl: event.target.value })
  }

  onCancel = () => {
    this.setState({ visible: false });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          type='primary'
          onClick={this.showModal}
        >
          Watch <Icon type='play-circle-o' />
        </Button>
        <Modal
          title='Watch fetch dialog'
          footer={null}
          onCancel={this.onCancel}
          visible={this.state.visible}
        >
          <Input
            placeholder='Enter fetch sample url'
            style={{ marginBottom: 20 }}
            onChange={this.handleChange}
          />
          <Button
            type='primary'
            onClick={this.handleSubmit}
          >
            Start watch
          </Button>
        </Modal>
      </React.Fragment>
    )
  }
}