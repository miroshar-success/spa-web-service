import * as React from 'react';
import { Table as AntdTable } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Pagination } from '@redux/common/table/types';

export interface TableProps {
  columns: Array<ColumnProps<object>>;
  dataSource: Array<object>;
  loading?: boolean;
  pagination?: Pagination;
  style?: React.CSSProperties;
  handleTableChange?: (pagination: Pagination) => any;
}

export default class Table extends React.Component<TableProps> {

  render() {
    const {
      columns,
      loading,
      pagination,
      dataSource,
      style,
      handleTableChange,
    } = this.props;

    return (
      <AntdTable
        bordered
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        size='small'
        style={style || { width: 1200, lineHeight: 1.8 }}
        onChange={handleTableChange}
      />
    )
  }
}