import * as React from 'react';
import { Input, Icon, Form, Button, Col, Row, DatePicker } from 'antd';
import { AuthorFormProps } from '../AuthorTable/FilterableAuthorsTable';

const FormItem = Form.Item;
const {RangePicker}  = DatePicker;

export default class AuthorForm extends React.Component<AuthorFormProps> {

  state = {
    name: "",
    surname: "",
    lifetime: "",
  };


  // addBook = (name: string, surname: string, lifetime: string) => {
  //   const {
  //     addBook
  //   } = this.props;   
        
  //   addBook(name, surname, lifetime);
  //   message.success('Added!');
  // }  

  change = (e: any) => {            
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = (e: any) => {

    e.preventDefault();

    this.setState({        
        name: "",
        surname: "",
        lifetime: "",
    });      
  };
      
  render() {
    return(
      <Row>
      <Col span={20}> 
        <label style={{marginLeft:130, fontSize: 24}}> New Author </label>
        <Form 
        className="login-form"
        style={{
          padding: "20px",           
          border: "1px solid",
          borderRadius: "5px",
          borderColor: "#ebedf0",
          width: "390px"
          }}>
          <FormItem>
              <Input                           
                prefix={<Icon type="user-add" />}
                value={this.state.name}
                onChange={e => this.change(e)} 
                placeholder="Enter the name" 
                name="name"
              />            
          </FormItem>
          <FormItem>            
              <Input
                prefix={<Icon type="user-add" />} 
                value={this.state.surname}
                onChange={e => this.change(e)}
                placeholder="Enter the surname" 
                name="surname"
              />
          </FormItem>
          <FormItem>
               <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['Birth' ,'Death']}
                onChange={e => this.change(e)} 
                //onOk={onOk}
              />
          </FormItem>
          <FormItem>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button"
              onClick={(e: any) => this.onSubmit(e)}>
              Add author
            </Button>
          </FormItem>
        </Form> 
      </Col>      
    </Row>
    );
  }
}