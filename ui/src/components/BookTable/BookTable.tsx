import * as React from 'react';
import { Table, Button, Icon, Popconfirm, message, Popover, Input, Form } from 'antd';
import { Book } from '@redux/books/types';
import { Pagination } from '@redux/common/table/types';
import { ColumnProps } from 'antd/lib/table';
import { BooksTableProps } from './FilterableBooksTable';

const FormItem = Form.Item;

export default class BookTable extends React.PureComponent<BooksTableProps> {

    state = {      
      name: "",
      author: "",
      cost: ""     
    };
    
    private readonly columns: ColumnProps<Book>[] = [      
      {
        title: 'Имя',
        dataIndex: 'name',           
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        filters: [
          { text: 'new', value: 'new' }         
        ],
        onFilter: (value, record) => record.name.includes(value),          
        render: (text, record) => <span>{record.name}</span>                
      },
      {
        title: 'Автор',
        dataIndex: 'author',
        key: 'author',
        sorter: (a, b) => a.author.localeCompare(b.author),
        render: (text, record) => <span>{record.author}</span>
      },
      {
        title: 'Цена',
        dataIndex: 'cost',
        key: 'cost',
        sorter: (a, b) => a.cost - b.cost,
        render: (text, record) => <span>{record.cost}</span>
      },
      { title: "Удалить",                               
        render: (text, record) =>
        <div> 
          <Popconfirm title="Are u sure delete this item?" 
            onConfirm={() => this.removeBook(record.key)}
            onCancel={this.cancelDelete}
            okText="Yes"
            cancelText="No">
              <Button
                size="small"
                type='danger'                
                >
                Удалить
                <Icon type="warning" /> 
              </Button>              
          </Popconfirm>
                              
        </div>
      },
      { title: 'Редактировать',
        render: (text, record) => 
        <div>
          <Popover                        
            placement="top" 
            title="Редактирование"
            trigger="click" 
            content={
              <div>
                <Form className="login-form">
                  <FormItem>
                    <Input
                      prefix={<Icon type="bars" />} 
                      placeholder="Edit the name"
                      value={this.state.name}
                      onChange={e => this.change(e)}
                      name="name"
                    />
                  </FormItem>
                  <FormItem>
                    <Input
                      prefix={<Icon type="bars" />}                      
                      placeholder="Edit the author" 
                      value={this.state.author}
                      onChange={e => this.change(e)}
                      name="author"
                    />
                  </FormItem>
                  <FormItem>
                    <Input
                      prefix={<Icon type="bars" />}
                      placeholder="Edit the cost"  
                      value={this.state.cost}
                      onChange={e => this.change(e)}
                      name="cost"
                    />
                  </FormItem>
                  <FormItem>
                  <Button
                    size="small"         
                    onClick={() => this.editBook(record.key)}                           
                    >
                    Сохранить
                    <Icon type="save" />
                  </Button>
                  </FormItem>
                </Form>
              </div>               
            }>
              <Button
                size="small"                          
              >
                Редактировать
                <Icon type="edit" />
              </Button>             
          </Popover> 
                                              
        </div>
      }
    ]
        
    change = (e: any) => {
      this.setState({
          [e.target.name]: e.target.value        
      });
    };
   
    editBook = (_id: string, ) => {      

      const {        
        editBook
      } = this.props;

      editBook(_id, this.state.name, this.state.author, Number.parseInt(this.state.cost));
      this.setState({
        name: "",
        author: "",
        cost: ""        
      });
      
      message.success('Edited!');
    }

    removeBook = (_id: string) => {
      const {        
        pagination,
        removeBook,
      } = this.props;  
      removeBook(_id, pagination);
      message.success('Deleted!');      
    }

    cancelDelete() {
      message.error('Cancel!');
    }
    
    componentDidMount() {
     
      const {
        pagination: {
          pageSize,
          current,
        },
        loadBooks,                
      } = this.props;  
      loadBooks({ pageSize, current });
    }
  
    handleTableChange = ({ pageSize, current }: Pagination, sorter: any) => {
      this.props.loadBooks({ pageSize, current }); 
      this.setState({
        sortedInfo: sorter
      });
      console.log('Various parameters', sorter);   
    }    
  
    render() {
      const {
        loading,
        pagination,
        books,
                
      } = this.props;
  
      return (
        <div>           
          <Table          
            bordered
            columns={this.columns}
            dataSource={books}          
            loading={loading}
            pagination={pagination}
            size='small'
            style={{ width: 800, lineHeight: 1.8 }}
            onChange={this.handleTableChange}
          />
        </div>                
      )
    }
  }