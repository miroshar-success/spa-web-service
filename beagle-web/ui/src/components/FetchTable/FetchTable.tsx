import * as React from 'react';
import { Table, Button, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FetchTableProps } from './FilterableFetchTable';
import { Fetch } from '@redux/fetch/types';
import { Pagination } from '@redux/common/table/types';

export default class FetchTable extends React.Component<FetchTableProps> {

  private readonly columns: ColumnProps<Fetch>[] = [
    {
      title: 'Тип клиента',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Идентификатор',
      dataIndex: 'personKey',
      key: 'personKey',
      render: (text, record) => <span>{JSON.stringify(record.personKey)}</span>
    },
    {
      title: 'Адрес загрузки',
      dataIndex: 'fetchUrl',
      key: 'fetchUrl',
    },
    {
      title: 'Дата создания',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: 'Состояние',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Селекторы',
      dataIndex: 'selectors',
      key: 'selectors',
      render: (text, record) => (
        <ul>
          {
            record.selectors.map(({ _id, sampleUrl, selector }) => (
              <li key={_id}>{sampleUrl} - {selector}</li>
            ))
          }
        </ul>
      )
    },
    {
      title: 'Селектор',
      dataIndex: 'selector',
      key: 'selector',
    },
    {
      title: 'Дата обновления',
      dataIndex: 'updateDate',
      key: 'updateDate',
    },
    {
      title: 'Последний результат',
      dataIndex: 'lastResult',
      key: 'lastResult',
      // TODO: Last result type?
      render: (text, record) => (
        <ul>
          {
            record.lastResult.map(result => (
              <li key={Math.random()}>{result}</li>
            ))
          }
        </ul>
      )
    },
    {
      title: 'Последний результат',
      dataIndex: 'Action',
      render: (text, record) => {
        return (
          <Button
            type='danger'
            onClick={() => this.removeFetch(record._id)}
          >
            Remove <Icon type='delete' />
          </Button>
        )
      }
    },
  ]

  componentDidMount() {
    const {
      pagination: {
        pageSize,
        current,
      },
      loadFetchs,
    } = this.props;

    loadFetchs({ pageSize, current });
  }

  handleTableChange = ({ pageSize, current }: Pagination) => {
    this.props.loadFetchs({ pageSize, current });
  }

  removeFetch = (id: string) => {
    this.props.removeFetch(id);
  }

  render() {
    const {
      loading,
      pagination,
      fetchs,
    } = this.props;

    return (
      <Table
        bordered
        columns={this.columns}
        dataSource={fetchs}
        loading={loading}
        pagination={pagination}
        size='small'
        style={{ width: '100%', lineHeight: 1.8 }}
        onChange={this.handleTableChange}
      />
    )
  }
}