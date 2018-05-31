
import * as React from 'react';
import { Table, Button, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import AddNewFetchExplore from './AddNewFetchExplore';
import FetchResultsTable from './FetchResultsTable';
import WatchFetchModal from './WatchFetchModal';
import { UserFetch, UserFetchSamples } from '@redux/userFetchs/types';

const cat = require('../../../assets/images/cat.jpeg');

export default class UserFetchsTable extends React.Component<any> {

  private readonly columns: ColumnProps<UserFetch>[] = [
    {
      title: 'Image',
      dataIndex: 'meta',
      key: 'image',
      render: (text, record) => <img src={cat} width={130} height={100} alt="image" />
    },
    {
      title: 'Title',
      dataIndex: 'meta',
      key: 'title',
      render: (text, record) => <span>{record.meta.title}</span>
    },
    {
      title: 'Fetch url',
      dataIndex: 'url',
      key: 'url',
      render: (text) => <a href={text}>{text}</a>
    },
    {
      dataIndex: 'Watch Action',
      render: (text, record) => {
        return (
          <WatchFetchModal
            fetchUrl={record && record.url}
            watchFetch={this.props.watchFetch}
          />
        )
      }
    },
    {
      dataIndex: 'Remove Action',
      render: (text, record) => {
        return (
          <Button
            type='danger'
            onClick={() => this.removeFetch(record.url)}
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

  expandedRowRender = (record: UserFetchSamples) => {
    const columns: ColumnProps<UserFetchSamples>[] = [
      {
        title: 'Image',
        dataIndex: 'meta',
        key: 'image',
        width: 200,
        render: (text, record) => <img src={cat} width={130} height={100} alt="image" />
      },
      {
        title: 'Title',
        dataIndex: 'meta',
        key: 'title',
        render: (text, record) => <span>{record.meta.title}</span>
      },
      {
        title: 'Sample url',
        dataIndex: 'url',
        key: 'url',
        render: (text, record) => <a href={text}>{text}</a>
      }
    ]

    if (Object.keys(this.props.sampleUrls).length > 0) {
      return (
        <Table
          columns={columns}
          pagination={false}
          dataSource={this.props.sampleUrls[record.key]}
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
          expandedRowRender={Object.keys(this.props.sampleUrls).length > 0 ? this.expandedRowRender : undefined}
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