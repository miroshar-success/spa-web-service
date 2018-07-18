import * as React from 'react';
import { Table, 
        Button, 
        Icon, 
        Popconfirm, 
        message, 
        Modal, 
        Input, 
        Form, 
        Upload,
        Select} from 'antd';
import { Book } from '@redux/books/types';
import { Pagination } from '@redux/common/table/types';
import { ColumnProps } from 'antd/lib/table';
import { BooksTableProps } from './FilterableBooksTable';

const FormItem = Form.Item;
const Option = Select.Option;

export default class BookTable extends React.PureComponent<BooksTableProps> {
 
    state = {
      _id: "",      
      name: "",
      author: "",
      cost: "",
      genre: "",
      visible: false,
      validateStatusErrorName: undefined,
      validateStatusErrorAuthor: undefined,
      validateStatusErrorCost: undefined,
      validateStatusErrorGenre: undefined,
      nameError: "",    
      authorError: "",
      costError: "",
      genreError: ""
    };
    
    private readonly columns: ColumnProps<Book>[] = [ 
      {
        width: 100,
        title: 'Изображение',
        dataIndex: 'img',
        key: 'img',        
        render: (text, record) =>
        <div>          
          <img src={'http://127.0.0.1:8887/' + record.url}  width="100" height="100"/>
        </div>                
      },
      {
        title: 'Имя',
        dataIndex: 'name',           
        key: 'name',
        //sorter: {},                                            insert sorting for name
        render: (text, record) => <span>{record.name}</span>        
      },
      {
        title: 'Автор',
        dataIndex: 'author',
        key: 'author',
        render: (text, record) => <span>{record.author}</span>
      },
      {
        title: 'Цена',
        dataIndex: 'cost',
        key: 'cost',
        // filterIcon:  <Icon type="search"/>,       
        render: (text, record) => <span>{record.cost}</span>
      },
      {
        title: 'Жанр',
        dataIndex: 'genre',
        key: 'genre',          
        // insert sorting method from back    
        render: (text, record) => <span>{record.genre}</span>
      },
      { width: 100,
        title: "Удалить",                               
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
      { width: 150,
        title: 'Редактировать',
        render: (text, record) => 
        <div>
          <Modal
            onOk={() => this.editBook(record.key)}
            onCancel={this.handleCancel}
            visible={this.state.visible}  
            title="Редактирование">             
                
                  <FormItem
                    label="Name"
                    validateStatus={this.state.validateStatusErrorName}
                    help={this.state.nameError}>
                    <Input
                      prefix={<Icon type="bars" />} 
                      placeholder="Edit the name"
                      value={this.state.name}
                      onChange={e => this.change(e)}
                      name="name"
                    />
                  </FormItem>
                  <FormItem
                    label="Author"
                    validateStatus={this.state.validateStatusErrorAuthor}
                    help={this.state.authorError}>
                    <Input
                      prefix={<Icon type="bars" />}                      
                      placeholder="Edit the author" 
                      value={this.state.author}
                      onChange={e => this.change(e)}
                      name="author"
                    />
                  </FormItem>
                  <FormItem
                    label="Cost"
                    validateStatus={this.state.validateStatusErrorCost}
                    help={this.state.costError}>
                    <Input 
                      prefix={<Icon type="bars" />}
                      placeholder="Edit the cost"
                      type="number"  
                      value={this.state.cost}
                      onChange={e => this.change(e)}
                      name="cost"
                    /> 
                  </FormItem>
                  <FormItem                    
                    label="Genre"
                    validateStatus={this.state.validateStatusErrorGenre}
                    help={this.state.genreError}>
                    <Select
                      placeholder="Select the genre"                       
                      style={{ width: 218 }}
                      defaultValue={this.state.genre} 
                      onChange={(value: any) => this.changeGenre(value)}>
                      <Option value="Fantasy">Fantasy</Option>
                      <Option value="Drama">Drama</Option>
                      <Option value="Humor">Humor</Option>
                      <Option value="Folklore">Folklore</Option>
                      <Option value="Horror">Horror</Option>
                    </Select>
                  </FormItem>                  
                  <FormItem>
                    <Upload 
                      name='file'
                      action={'data/books/postload?_id=' + this.state._id}>                      
                      <Button>
                        <Icon type="upload" /> Click to Upload
                      </Button>
                    </Upload>
                  </FormItem>                                
          </Modal>
          <Button 
            size="small"
            onClick={() => this.startEdit(record)}
          >
            Редактировать
            <Icon type="edit" />
          </Button>                                              
        </div>  
      }
    ]
       
    handleCancel = () => {      
      this.setState({
        visible: false,
      });
    }

    changeGenre = (value: any) => { 
      this.setState({
        genre: value
      });    
    };

    validate = () => {      
      let isError = false;
      if(this.state.name.length < 3 ) {
        isError = true;
        this.setState({
          nameError: "Name needs to be atleast 3 characters long",
          validateStatusErrorName: "error"
        });
      }
  
      if(this.state.author.length < 3) {
        isError = true;
        this.setState({
          authorError: "Author needs to be atleast 3 characters long",
          validateStatusErrorAuthor: "error"
        });
      }
  
      if((Number.parseInt(this.state.cost) <= 0) || (this.state.cost.length == 0)) {
        isError = true;
        this.setState({
          costError: "Cost must be more than 0",
          validateStatusErrorCost: "error"
        });
      }
  
      return isError;
    };

    change = (e: any) => {
      this.setState({
          [e.target.name]: e.target.value        
      });
    };
   
    startEdit = (record: Book) => {
      console.log(record);

      this.setState({
        _id: record.key,        
        name: record.name,
        author: record.author,
        cost: record.cost,
        genre: record.genre,
        visible: true,
      });
    };

    editBook = (_id: string) => {
      const {        
        editBook
      } = this.props;

      this.setState({      
        validateStatusErrorName: undefined,
        validateStatusErrorAuthor: undefined,
        validateStatusErrorCost: undefined,
        validateStatusErrorGenre: undefined,
        nameError: "",    
        authorError: "",
        costError: "",
        genreError: ""
      });

      const err = this.validate();

      if(!err) {
        console.log(this.state);
        editBook(this.state._id, this.state.name, this.state.author, Number.parseInt(this.state.cost), this.state.genre);
        this.setState({
          name: "",
          author: "",
          cost: "",
          genre: "",
          validateStatusErrorName: undefined,
          validateStatusErrorAuthor: undefined,
          validateStatusErrorCost: undefined,
          validateStatusErrorGenre: undefined,
          nameError: "",    
          authorError: "",
          costError: "" ,
          genreError: "",
          visible: false       
        });        
        message.success('Edited!');
      } 
    };

    removeBook = (_id: string) => {
      const {        
        pagination,
        removeBook,
      } = this.props;  
      removeBook(_id, pagination);
      message.success('Deleted!');      
    };

    cancelDelete() {
      message.error('Cancel!');
    };
    
    componentDidMount() {
     
      const {
        pagination: {
          pageSize,
          current,
        },
        loadBooks,                
      } = this.props;  
      loadBooks({ pageSize, current });
    };
  
    handleTableChange = ({ pageSize, current }: Pagination) => {
      this.props.loadBooks({ pageSize, current });      
    };   
  
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
            style={{ width: 1100 }}
            onChange={this.handleTableChange}
          />
        </div>                
      )
    }
  }