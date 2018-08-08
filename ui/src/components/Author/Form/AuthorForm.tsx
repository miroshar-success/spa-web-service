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
    dod: "",
    validateStatusErrorName: undefined,
    validateStatusErrorSurname: undefined,
    nameError: "",
    surnameError: ""
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

  validate = () => {

    let isError = false;       

    if(this.state.name.length == 0 ) {
      isError = true;
      this.setState({
        nameError: "Please, fill the field",
        validateStatusErrorName: "error"
      });
    }

    if(this.state.surname.length == 0 ) {
      isError = true;
      this.setState({
        surnameError: "Please, fill the field",
        validateStatusErrorSurname: "error"
      });
    }

    return isError;
  };

  onSubmit = (e: any) => {
  
    this.setState({        
        name: "",
        surname: "",
        dob: "",
        dod: "",
        validateStatusErrorName: undefined,
        validateStatusErrorSurname: undefined,
        nameError: "",
        surnameError: ""
    }); 

    e.preventDefault();
    const err = this.validate();

    if(!err) {
      console.log(this.state)  
      this.addAuthor(this.state.name, this.state.surname, this.state.dob, this.state.dod);
      this.setState({        
          name: "",
          surname: "",
          dob: "",
          dod: "",
          validateStatusErrorName: undefined,
          validateStatusErrorSurname: undefined,
          nameError: "",
          surnameError: ""
      });
    }
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
          <FormItem
            validateStatus={this.state.validateStatusErrorName}
            help={this.state.nameError}>
              <Input                           
                prefix={<Icon type="user-add" />}
                value={this.state.name}
                onChange={(e) => this.change(e)} 
                placeholder="Enter the name" 
                name="name"
              />            
          </FormItem>
          <FormItem
              validateStatus={this.state.validateStatusErrorSurname}
              help={this.state.surnameError}>            
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
                onChange={this.changeDoB}
                placeholder={"Date of Birth"}
                
                
              />
              <DatePicker
                format={dateFormat} 
                style={{marginLeft: 5}}
                onChange={(value, dateString) => this.changeDoD(value, dateString)}
                placeholder={"Date of Death"}
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