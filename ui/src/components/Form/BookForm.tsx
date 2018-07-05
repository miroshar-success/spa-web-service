import * as React from 'react';
import { Input, Icon, Form, Button, message, Upload } from 'antd';
import { BookFormProps } from '../BookTable/FilterableBooksTable';

const FormItem = Form.Item;



export default class BookForm extends React.Component<BookFormProps> {

  state = {
    name: "",
    author: "",
    cost: "",
    url: "",
    validateStatusErrorName: undefined,
    validateStatusErrorAuthor: undefined,
    validateStatusErrorCost: undefined,
    nameError: "",    
    authorError: "",
    costError: ""
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

  addBook = (name: string, author: string, cost: number) => {
    const {
      pagination,
      addBook
    } = this.props;   
    
    addBook(name, author, cost, pagination);
    message.success('Added!');
  }

  change = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = (e: any) => {

    this.setState({      
      validateStatusErrorName: undefined,
      validateStatusErrorAuthor: undefined,
      validateStatusErrorCost: undefined,
      nameError: "",    
      authorError: "",
      costError: ""
    });

    e.preventDefault();
    const err = this.validate();

    if(!err) {
      this.addBook(this.state.name, this.state.author, Number.parseInt(this.state.cost));
      this.setState({
        name: "",
        author: "",
        cost: "",
        url: "",
        validateStatusErrorName: undefined,
        validateStatusErrorAuthor: undefined,
        validateStatusErrorCost: undefined,
        nameError: "",    
        authorError: "",
        costError: ""
      }); 
    }       
  };
  
  render() {
    return(     
        <Form className="login-form">
          <FormItem
            validateStatus={this.state.validateStatusErrorName}
            help={this.state.nameError}>
              <Input                           
                prefix={<Icon type="book" />}
                value={this.state.name}
                type="text"
                onChange={e => this.change(e)} 
                placeholder="Enter the name" 
                name="name"
              />            
          </FormItem>
          <FormItem 
            validateStatus={this.state.validateStatusErrorAuthor}
            help={this.state.authorError}>            
              <Input
                prefix={<Icon type="user" />} 
                value={this.state.author}
                type="text"
                onChange={e => this.change(e)}
                placeholder="Enter the author" 
                name="author"
              />
          </FormItem>
          <FormItem
            validateStatus={this.state.validateStatusErrorCost}
            help={this.state.costError}>
              <Input
                prefix={<Icon type="credit-card" />}
                value={this.state.cost}
                type="number"
                onChange={e => this.change(e)} 
                placeholder="Enter the cost" 
                name="cost"
              />
          </FormItem>
          <FormItem>
          <Upload 
            name='file'
            action='data/books/upload'>
            
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
          </FormItem>
          <FormItem>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button"
              onClick={(e: any) => this.onSubmit(e)}>
              Добавить
            </Button>
          </FormItem>
        </Form> 
    );
  }
}