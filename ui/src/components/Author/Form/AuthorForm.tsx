import * as React from 'react';
import { Input, Icon, Form, Button, Col, Row, DatePicker } from 'antd';
import { AuthorFormProps } from '../AuthorTable/FilterableAuthorsTable';

const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';

export default class AuthorForm extends React.Component<AuthorFormProps> {

  state = {
    name: "",
    surname: "",
    dob: undefined,
    dod: undefined
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
    console.log(e)
  };

  changeDoB = (value: any,  dateString: any) => {
    this.state.dob = dateString;
    console.log(this.state.dob)
  };
  changeDoD = (value: any,  dateString: any) => {
    this.state.dod = dateString;
    console.log(this.state.dod)
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    this.setState({        
        name: "",
        surname: "",
        lifetime: [],
    }); 
   // console.log(this.state.lifetime)    // output data   ["2018-08-27", "2018-08-29"]  
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
                onChange={(e) => this.change(e)} 
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
              <DatePicker 
                format={dateFormat} 
                onChange={(value, datePicker) => this.changeDoB(value, datePicker)}
                placeholder={"Date of Birth"}
                value={this.state.dob}
              />
               
              <DatePicker
                format={dateFormat} 
                onChange={(value, dateString) => this.changeDoD(value, dateString)}
                placeholder={"Date of Death"}
                value={this.state.dod}
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