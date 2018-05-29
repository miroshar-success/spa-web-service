
import * as React from 'react';
import { Table, Button, Icon } from 'antd';
import AddNewFetchExplore from './AddNewFetchExplore';
import FetchResultsTable from './FetchResultsTable';
import WatchFetchModal from './WatchFetchModal';

export default class UserFetchsTable extends React.Component<any> {

  state = {
    open: false,
    fetchUrl: '',
  }

  private readonly columns: any = [
    {
      title: 'Fetch url',
      dataIndex: 'fetchUrl',
      key: 'fetchUrl',
      render: (text: any, record: any) => <a href={text}>{text}</a>
    },
    {
      dataIndex: 'Watch Action',
      render: (text: any, record: any) => {
        return (
          <Button
            type='primary'
            onClick={() => this.openWatchFetchModal(record.fetchUrl)}
          >
            Watch <Icon type='play-circle-o' />
          </Button>
        )
      }
    },
    {
      dataIndex: 'Remove Action',
      render: (text: any, record: any) => {
        return (
          <Button
            type='danger'
            onClick={() => this.removeFetch(record.fetchUrl)}
          >
            Remove <Icon type='delete' />
          </Button>
        )
      }
    },
  ]

  componentDidMount() {
    const {
      loadUserFetchs,
    } = this.props;

    loadUserFetchs('test');
  }

  openWatchFetchModal = (fetchUrl: string) => {
    this.setState({
      open: true,
      fetchUrl,
    })
  }

  onCancel = () => {
    this.setState({
      open: false,
      fetchUrl: null,
    })
  }

  onOk = (sampleUrl: string) => {
    this.setState({
      open: false,
      fetchUrl: null,
    })
    this.props.watchFetch(this.state.fetchUrl, sampleUrl);
  }

  removeFetch = (id: string) => {
    this.props.removeFetch(id);
  }

  expandedRowRender = (record: any) => {
    const columns: any = [
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Sample url',
        dataIndex: 'url',
        key: 'url',
        render: (text: any, record: any) => <a href={text}>{text}</a>
      }
    ]
    debugger
    const dataSource = this.props.sampleUrls;

    return (
      <Table
        columns={columns}
        pagination={false}
        dataSource={dataSource}
      />
    )
  }

  render() {
    const {
      fetches,
      resultUrls,
    } = this.props;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AddNewFetchExplore addNewFetchUrlForExplore={this.props.addNewFetchUrlForExplore} />
        <WatchFetchModal
          onOk={this.onOk}
          onCancel={this.onCancel}
          open={this.state.open}
        />
        <Table
          columns={this.columns}
          pagination={false}
          dataSource={fetches}
          expandedRowRender={this.expandedRowRender}
          size='small'
          style={{ width: '100%', lineHeight: 1.8 }}
        />
        <FetchResultsTable dataSource={resultUrls} />
      </div>
    )
  }
}