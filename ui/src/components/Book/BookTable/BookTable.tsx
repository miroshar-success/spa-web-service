import * as React from 'react';
import { Table, 
  Button, Icon, Popconfirm, 
  message, 
  Input, Form, Upload, Select, Modal
} from 'antd';
import { Book } from '@redux/books/types';
import { Pagination } from '@redux/common/table/types';
import { ColumnProps } from 'antd/lib/table';
import { BooksTableProps } from '@components/Book/BookTable/FilterableBooksTable';
import LazyLoad from 'react-lazyload';

const FormItem = Form.Item;
const Option = Select.Option;

const options = [
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Drama',  value: 'Drama' },
  { label: 'Humor',  value: 'Humor' },
  { label: 'Folklore',  value: 'Folklore' },
  { label: 'Horror',  value: 'Horror' },
];

export default class BookTable extends React.PureComponent<BooksTableProps> {
    state = { 
      _id: "",     
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
      costError: "",
      genreError: "",
      visible: false,
      minValue: "",
      maxValue: "",
      previewImage: '',
      previewVisible: false,
      checkedList: [''],
    };    
    
    handleCancel = () => this.setState({ previewVisible: false })
    
    handlePreview = () => {
      this.setState({
        previewVisible: true, 
      });
    }

    private readonly columns: ColumnProps<Book>[] = [ 
      {
        width: 120,
        title: 'Изображение',
        dataIndex: 'img',
        key: 'img',        
        render: (text, record) =>
        <LazyLoad
          height="120px"          
          debounce={true}
          once>
          <img src={'http://127.0.0.1:8887/' + record.url} 
                onClick={this.handlePreview} 
                width="100px" 
                height="120px" />
        </LazyLoad>              
      },
      {
        title: 'Name',
        dataIndex: 'name',           
        key: 'name',
        render: (text, record) => 
        <LazyLoad
          height="120px"          
          debounce={true}
          once>
          <span>{record.name}</span>
        </LazyLoad>
      },      
      {
        title: 'Автор',
        dataIndex: 'author',
        key: 'author',        
        render: (text, record) => 
        <LazyLoad
          height="120px"          
          debounce={true}
          once>
          <span>{record.author}</span>
        </LazyLoad>
      },
      {
        title: 'Цена',
        dataIndex: 'cost',
        key: 'cost',
        render: (text, record) => 
        <LazyLoad
          height="120px"          
          debounce={true}
          once>
          <span>{record.cost}</span>
        </LazyLoad> 
      },
      {
        title: 'Жанр',
        dataIndex: 'genre',
        key: 'genre',        
        render: (text, record) => 
        <LazyLoad
          height="120px"          
          debounce={true}
          once>
        <span>{record.genre}</span>
        </LazyLoad>
      },
      { width: 100,
        title: "Удалить",                               
        render: (text, record) =>
        <LazyLoad
          height="120px"          
          debounce={true}
          once>
          <div> 
            <Popconfirm title="Are u sure?" 
              onConfirm={() => this.removeBook(record.key)}            
              onCancel={() => message.error('Cancel!')}
              okText="Yes"
              cancelText="No">
                <Button
                  size="small"
                  type="danger">                
                  Удалить
                  <Icon type="warning" /> 
                </Button>              
            </Popconfirm>                              
          </div>
        </LazyLoad>
      },     
      { width: 100,
        title: 'Редактировать',
        render: (text, record) =>
        <LazyLoad
          height="120px"          
          debounce={true}
          once>
        <div>
            <Modal
                onOk={() => this.editBook(record.key)}
                onCancel={() =>  this.setState({ visible: false })}
                visible={this.state.visible}  
                title="Редактирование">
              <Form className="login-form">
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
                  validateStatus={this.state.validateStatusErrorGenre}
                  help={this.state.genreError}>
                    <Select
                      defaultValue={this.state.genre}                                
                      style={{ width: 218 }} 
                      onChange={(value: any) => this.setState({ genre: value })}>
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
              </Form>
            </Modal>
          <Button 
            size="small"
            onClick={() => this.startEdit(record)}>
            Редактировать
            <Icon type="edit" />
          </Button>                      
        </div>
        </LazyLoad>
      }
    ]
    
    onChange = (checkedList: any) => { 
      this.setState({
        genre: checkedList,
        checkedList,
      });
    }
        
    handleReset(e: any) {
      const {
        pagination: {
          pageSize,
          current,
        },
        loadBooks,                
      } = this.props;  
      loadBooks({ pageSize, current });
      this.setState({
        checkedList: e.target.checked ? options : [],
      });  
    };
    
    validate = () => {      
      let isError = false;
      this.defaultState;
      if(this.state.name.length <= 0 ) {
        isError = true;
        this.setState({
          nameError: "Please, fill the field",
          validateStatusErrorName: "error"
        });
      }
  
      if((Number.parseInt(this.state.cost) <= 0) || (this.state.cost.length == 0)) {
        isError = true;
        this.setState({
          costError: "Cost must be more than 0",
          validateStatusErrorCost: "error"
        });
      } 
      
      if(this.state.author.length <= 0 ) {
        isError = true;
        this.setState({
          authorError: "Please, fill the field",
          validateStatusErrorAuthor: "error"
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
      this.setState({
        _id: record.key,
        name: record.name,
        author: record.author,
        cost: record.cost,
        genre: record.genre,
        visible: true
      });
    };

    defaultState = () => {
      this.setState({
        _id: "",
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
        costError: "",
        genreError: ""
      });
    };  

    editBook = (_id: string) => {  

      const {        
        editBook
      } = this.props;

      this.defaultState();
  
      const err = this.validate(); 

      if(!err) {
        editBook(this.state._id, this.state.name, this.state.author, Number.parseInt(this.state.cost), this.state.genre);
        this.defaultState();
        this.state.visible = false;     
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



