
import * as React from 'react';
import { Table } from 'antd';
const cat = require('../../../assets/images/cat.jpeg')


export default class FetchResultsTable extends React.Component<any> {

  private readonly columns: any = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text: any, record: any) => <img src={cat} width={130} height={100} alt="image" />
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Result url',
      dataIndex: 'url',
      key: 'url',
      render: (text: any, record: any) => <a href={text}>{text}</a>
    },

  ]

  render() {
    const {
      dataSource,
    } = this.props;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 200 }}>
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