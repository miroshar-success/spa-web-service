import * as React from 'react';
import { Input, Icon, Form, Button, Col, Row, DatePicker, message } from 'antd';
import { AuthorFormProps } from '@components/Author/AuthorTable/FilterableAuthorsTable';

const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';

export default class AuthorForm extends React.Component<AuthorFormProps> {

  state = {
    name: "",
    surname: "",
    dob: "",
    dod: ""
  };

  change = (e: any) => {    
    this.setState({
      [e.target.name]: e.target.value
    });
    //console.log(e)
  };

  changeDoB = (date: any,  dateString: any) => {
    this.state.dob = dateString;
    //console.log(this.state.dob)
  };
  changeDoD = (date: any,  dateString: any) => {
    this.state.dod = dateString;
    //console.log(this.state.dod)
  };

  onSubmit = (e: any) => {
  
    this.setState({        
        name: "",
        surname: "",
        dob: "",
        dod: ""
    }); 

    e.preventDefault();
    //const err = this.validate();
   // console.log(this.state.lifetime)    // output data   ["2018-08-27", "2018-08-29"]  
   this.addAuthor(this.state.name, this.state.surname, this.state.dob, this.state.dod);
   this.setState({        
      name: "",
      surname: "",
      dob: "",
      dod: ""
   });
  
  };

  addAuthor = (name: string, surname: string, dob: string, dod: string) => {
    const {
      //pagination,
      addAuthor
    } = this.props;   
        
    addAuthor(name, surname, dob, dod);
    message.success('Added!');
  }  
      
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
                style={{marginLeft: 5}}
                //onChange={(date, datePicker) => this.changeDoB(date, datePicker)}
                onChange={this.changeDoB}
                placeholder={"Date of Birth"}
                //value={this.state.dob}
                
              />
              <DatePicker
                format={dateFormat} 
                style={{marginLeft: 5}}
                onChange={(value, dateString) => this.changeDoD(value, dateString)}
                placeholder={"Date of Death"}
                //value={this.state.dod}
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