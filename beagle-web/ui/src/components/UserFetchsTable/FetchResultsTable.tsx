
import * as React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Models } from '@redux/userFetchs/types';

const cat = require('../../../assets/images/cat.jpeg')
const fingerPointer = require('../../../assets/images/finger-pointer.png')

export interface FetchResultsTableProps {
  dataSource: Array<Models.UserFetchResults>;
}

export default class FetchResultsTable extends React.Component<FetchResultsTableProps> {

  private readonly columns: ColumnProps<Models.UserFetchResults>[] = [
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
      dataIndex: 'fetchUrl',
      key: 'fetchUrl',
      render: (text) => <a href={text}>{text}</a>
    },
    {
      title: 'Result url',
      dataIndex: 'url',
      key: 'url',
      render: (text) => <a href={text}>{text}</a>
    },

  ]

  render() {
    const {
      dataSource,
    } = this.props;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
        <h1>Fetch results</h1>
        <img src={fingerPointer} width={200} height={200} style={{ marginBottom: 20 }} alt="pointer" />
        <Table
          columns={this.columns}
          dataSource={dataSource}
          size='small'
          style={{ width: '100%', lineHeight: 1.8 }}
        />
      </div>
    )
  }
}