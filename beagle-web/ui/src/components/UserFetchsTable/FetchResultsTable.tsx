
import * as React from 'react';
import { Table } from 'antd';
const cat = require('../../../assets/images/cat.jpeg')
const fingerPointer = require('../../../assets/images/finger-pointer.png')


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