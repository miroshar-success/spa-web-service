import * as React from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Link } from 'react-router-dom';
import { SignInUser } from '@redux/auth/types';

const FormItem = Form.Item;

export interface SignInFormProps {
  form: WrappedFormUtils;
  signIn: (user: SignInUser) => any;
}

class SignInForm extends React.Component<SignInFormProps> {

  handleSubmit = (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.signIn(values);
      }
    });

  }

  render() {
    const {
      getFieldDecorator,
    } = this.props.form;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <Form onSubmit={this.handleSubmit} style={{ width: 300 }}>
          <h1 style={{ textAlign: 'center' }}>Sign in form</h1>
          <FormItem>
            {
              getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your email'
                  }
                ]
              })(
                <Input prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Input your email' />
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
                <Input type='password' prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Input your email' />
              )
            }
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
              Sign in
             </Button>
          </FormItem>
          <FormItem style={{ marginTop: '-10px' }}>
            Or <Link to='/signup'> sign up!</Link>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(SignInForm);