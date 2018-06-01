
import * as React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Models } from '@redux/userFetchs/types';

import '@components/common/styles/antdTableFix.css';

const cat = require('../../../assets/images/cat.jpeg')

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          size='small'
          style={{ width: '100%', lineHeight: 1.8 }}
          title={() => <h3 style={{ textAlign: 'center' }}>Fetch results</h3>}
        />
      </div>
    )
  }
}