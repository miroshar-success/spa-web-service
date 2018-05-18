import * as React from 'react';
import { Table } from 'antd';
import { Person, Pagination } from '@redux/persons/types';

export interface PersonsTableProps {
  persons: Array<Person>;
  pagination: Pagination;
  loading: boolean;
  error: string;
  loadPersons: (pagination: Pagination) => any;
}

class PersonsTable extends React.Component<PersonsTableProps> {

  private readonly columns: any = [
    {
      title: 'Идентификатор',
      dataIndex: 'personId',
      key: 'personId',
    },
    {
      title: 'Тип',
      dataIndex: 'personType',
      key: 'personType',
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
    } = this.props

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table
          bordered
          columns={this.columns}
          dataSource={persons}
          loading={loading}
          pagination={pagination}
          size='small'
          style={{ width: 800, marginTop: 100, lineHeight: 1.8 }}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

export default PersonsTable;