import * as React from 'react';
import { Input, Icon, Form, Button, Col, Row, Checkbox, Radio } from 'antd';
import { FilterPanelProps } from '../BookTable/FilterableBooksTable';



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
    { label: 'Name', value: 'Name' },
    { label: 'Author', value: 'Author' }  
  ];
  const radio2 = [
    { label: 'Asc', value: 'Asc' },
    { label: 'Desc', value: 'Desc' },
  ];

export default class FilterPanel extends React.Component<FilterPanelProps> {

  state = {
    minValue: 0,
    maxValue: 0,
    genre: "",
    field: "",
    order: "",
    checkedList: [''],
  };

  change = (e: any) => {            
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(e);
  };

  onChange = (checkedList: any) => { 
    this.setState({
      genre: checkedList,
      checkedList,
    });
    console.log(checkedList);
  }
 
    onSubmit = (field: string, order: string, genre: string, minValue: number, maxValue: number) => {
      const {
        pagination,
        sortBook
      } = this.props;
      sortBook(field, order, genre, minValue, maxValue, pagination);  
    };

  render() {
    return(
      <Row>
      <Col> Filters
        <Form 
        className="login-form"
        style={{
          padding: "20px",           
          border: "1px solid",
          borderRadius: "5px",
          borderColor: "#ebedf0",
          width: "260px"
          }}>
            <FormItem> Sort by
              
            <RadioGroup 
                style={{ marginTop: 50 }}
                options={radio1}
                onChange={e => this.change(e)}
            /> 
            <RadioGroup 
                options={radio2}
                onChange={e => this.change(e)}
            />         
          </FormItem>


          <FormItem> Cost
              
              <Input                           
                prefix={<Icon type="wallet" />}
                value={this.state.minValue}
                onChange={e => this.change(e)} 
                placeholder="Min" 
                name="minValue"
              />  
              <Input
                prefix={<Icon type="wallet" />} 
                value={this.state.maxValue}
                onChange={e => this.change(e)}
                placeholder="Max" 
                name="maxValue"
              />          
          </FormItem>

          <FormItem> Genres
            <CheckboxGroup 
                options={options} 
                style={{ height: 120}}
                value={this.state.checkedList}
                onChange={this.onChange}
                /> 
            </FormItem>          
          
          <FormItem>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button"
              onClick={() => this.onSubmit(this.state.field, this.state.order, this.state.genre, this.state.minValue, this.state.maxValue)}
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