import * as React from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;

export interface LoginFormProps {
  form: WrappedFormUtils;
}

class LoginForm extends React.Component<LoginFormProps> {

  handleSubmit = (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        this.props.form.resetFields();
      }
      // if (!err) {
      //   fetch('http://localhost:3001/api/v1/login', {
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json'
      //     },
      //     method: 'POST',
      //     body: JSON.stringify(values)
      //   }).then(response => response.json())
      //     .then(json => {
      //       alert(json.success)
      //     })
      // }
    });

  }

  render() {
    const {
      getFieldDecorator,
    } = this.props.form;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <Form onSubmit={this.handleSubmit} style={{ maxWidth: 300 }}>
          <h1>Log in Form</h1>
          <FormItem>
            {
              getFieldDecorator('login', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your login'
                  }
                ]
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Input your login' />
              )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password'
                  }
                ]
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Input your password' />
              )
            }
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
              Log in
             </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(LoginForm);