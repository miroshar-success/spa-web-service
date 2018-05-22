import * as React from 'react';
import { Table, Popover, Icon } from 'antd';
import { Person } from '@redux/persons/types';
import { Pagination } from '@redux/common/table/types';
import { ColumnProps } from 'antd/lib/table';
import { PersonsTableProps } from './FilterablePersonsTable';

export default class PersonsTable extends React.Component<PersonsTableProps> {

  private readonly columns: ColumnProps<Person>[] = [
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
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <span>{record.personInfo.name}</span>
    },
    {
      title: 'Фамилия',
      dataIndex: 'surname',
      key: 'surname',
      render: (text, record) => <span>{record.personInfo.surname}</span>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        const PersonInfo: React.ReactNode = <div>{JSON.stringify(record.personInfo, null, 2)}</div>
        return (
          <Popover placement='top' content={PersonInfo} trigger='click'>
            <a href="#">
              More <Icon type='down' />
            </a>
          </Popover>
        )
      }
    }
  ]

  componentDidMount() {
    const {
      pagination: {
        pageSize,
        current,
      },
      loadPersons,
    } = this.props;

    loadPersons({ pageSize, current });
  }

  handleTableChange = ({ pageSize, current }: Pagination) => {
    this.props.loadPersons({ pageSize, current });
  }

  render() {
    const {
      loading,
      pagination,
      persons,
    } = this.props;

    return (
      <Table
        bordered
        columns={this.columns}
        dataSource={persons}
        loading={loading}
        pagination={pagination}
        size='small'
        style={{ width: 800, lineHeight: 1.8 }}
        onChange={this.handleTableChange}
      />
    )
  }
}