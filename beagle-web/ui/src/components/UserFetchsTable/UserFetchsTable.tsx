
import * as React from 'react';
import { Table, Button, Icon } from 'antd';
import AddNewFetchExplore from './AddNewFetchExplore';
import FetchResultsTable from './FetchResultsTable';
import WatchFetchModal from './WatchFetchModal';

const cat = require('../../../assets/images/cat.jpeg');

export interface TableRecord {
  key: string;
  fetchUrl: string;
}

export default class UserFetchsTable extends React.Component<any> {

  private readonly columns: any = [
    {
      title: 'Fetch url',
      dataIndex: 'fetchUrl',
      key: 'fetchUrl',
      render: (text: string, ) => <a href={text}>{text}</a>
    },
    {
      dataIndex: 'Watch Action',
      render: (record: TableRecord) => {
        return (
          <WatchFetchModal
            fetchUrl={record.fetchUrl}
            watchFetch={this.props.watchFetch}
          />
        )
      }
    },
    {
      dataIndex: 'Remove Action',
      render: (record: TableRecord) => {
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
      userDetails: { name },
    } = this.props;

    loadUserFetchs(name);
  }

  removeFetch = (fetchUrl: string) => {
    this.props.removeFetch(fetchUrl);
  }

  expandedRowRender = (record: any) => {
    const columns: any = [
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        width: 200,
        render: (text: any, record: any) => <img src={cat} width={130} height={100} alt="image" />
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

    if (this.props.sampleUrls.length > 0) {
      return (
        <Table
          columns={columns}
          pagination={false}
          dataSource={this.props.sampleUrls}
        />
      )
    }

    return null;

  }

  render() {
    const {
      fetches,
      loading,
      resultUrls,
    } = this.props;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AddNewFetchExplore
          fetchSamplesReceived={!loading}
          addNewFetchUrlForExplore={this.props.addNewFetchUrlForExplore}
        />
        <Table
          columns={this.columns}
          pagination={false}
          loading={loading}
          dataSource={fetches}
          expandedRowRender={this.props.sampleUrls.length > 0 ? this.expandedRowRender : undefined}
          size='small'
          style={{ width: '100%', lineHeight: 1.8 }}
        />
        {
          resultUrls.length > 0 && <FetchResultsTable dataSource={resultUrls} />
        }
      </div>
    )
  }
}