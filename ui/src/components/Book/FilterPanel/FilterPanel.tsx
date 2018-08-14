import * as React from 'react';
import { Input, Icon, Form, Button, Col, Row, Checkbox, Radio } from 'antd';
import { FilterPanelProps } from '@components/Book/BookTable/FilterableBooksTable';



const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const options = [
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Drama',  value: 'Drama' },
    { label: 'Humor',  value: 'Humor' },
    { label: 'Folklore',  value: 'Folklore' },
    { label: 'Horror',  value: 'Horror' },
  ];
  const radio1 = [
    { label: 'Name', value: 'name' },
    { label: 'Author', value: 'author' }  
  ];
  const radio2 = [
    { label: 'Asc', value: 'asc' },
    { label: 'Desc', value: 'desc' },
  ];

export default class FilterPanel extends React.Component<FilterPanelProps> {

  state = {
    minValue: "",
    maxValue: "",
    genre: "",
    field: "",
    order: "",
    checkedList: [],
  };

  change = (e: any) => {            
    this.setState({
      [e.target.name]: e.target.value
    });
    //console.log(e);
  };

  onChange = (checkedList: any) => { 
    this.setState({
      genre: checkedList,
      checkedList,
    });
    //console.log(checkedList);
  }
 
    onSubmit = (field: string, order: string, genre: string, minValue: number, maxValue: number) => {
      const {
        pagination,
        sortBook
      } = this.props;
      
      //console.log(this.state);

      sortBook(field, order, genre, minValue, maxValue, pagination);  
    };

  render() {
    return(
      <Row>
      <Col> Filters
        <Form 
        className="login-form"
        style={{
          padding: "10px",           
          border: "1px solid",
          borderRadius: "5px",
          borderColor: "#ebedf0",
          width: "260px"
          }}>
            <FormItem style={{margin: 0}}> Sort by
              
            <RadioGroup
                name="field" 
                style={{ marginLeft: 20 }}
                options={radio1}
                onChange={e => this.change(e)}
            /> 
            <RadioGroup
                name="order" 
                style={{ marginLeft: 64 }}
                options={radio2}
                onChange={e => this.change(e)}
            />         
          </FormItem>


          <FormItem style={{margin: 0}}> Cost
              
              <Input                           
                prefix={<Icon type="wallet" />}
                value={this.state.minValue}
                type="number"
                onChange={e => this.change(e)} 
                placeholder="Min" 
                name="minValue"
              />  
              <Input
                prefix={<Icon type="wallet" />} 
                value={this.state.maxValue}
                type="number"
                onChange={e => this.change(e)}
                placeholder="Max" 
                name="maxValue"
              />          
          </FormItem>

          <FormItem style={{margin: 0}}> Genres
            <CheckboxGroup 
                options={options} 
                style={{ height: 120}}
                value={this.state.checkedList}
                onChange={this.onChange}
                /> 
            </FormItem>          
          
          <FormItem style={{margin: 0}}>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button"
              onClick={() => this.onSubmit(this.state.field, this.state.order, this.state.genre, Number.parseInt(this.state.minValue), Number.parseInt(this.state.maxValue))}
              >
              Submit
            </Button>
          </FormItem>
        </Form> 
      </Col>      
    </Row>
    );
  }
}