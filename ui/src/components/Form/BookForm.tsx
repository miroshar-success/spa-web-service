import * as React from 'react';
import { Input, Icon, Form, Button, message } from 'antd';
import { BookFormProps } from '../BookTable/FilterableBooksTable';

const FormItem = Form.Item;

export default class BookForm extends React.Component<BookFormProps> {

  state = {
    name: "",
    author: "",
    cost: ""
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
    e.preventDefault(); 
    this.addBook(this.state.name, this.state.author, Number.parseInt(this.state.cost));
    this.setState({
      name: "",
      author: "",
      cost: ""
    });    
  };
  
  render() {
    return(     
        <Form className="login-form">
          <FormItem>
            <Input             
              prefix={<Icon type="book" />}
              value={this.state.name}
              onChange={e => this.change(e)} 
              placeholder="Enter the name" 
              name="name"/>            
          </FormItem>
          <FormItem >
            <Input
            prefix={<Icon type="user" />} 
            value={this.state.author}
            onChange={e => this.change(e)}
            placeholder="Enter the author" 
            name="author"/>
          </FormItem>
          <FormItem>
            <Input
            prefix={<Icon type="credit-card" />}
            value={this.state.cost}
            onChange={e => this.change(e)} 
            placeholder="Enter the cost" 
            name="cost"/>
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