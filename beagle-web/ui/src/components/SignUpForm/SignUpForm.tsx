import * as React from 'react';
import { Form, Input, Button, Icon, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Link } from 'react-router-dom';
import { SignUpSignature } from '@redux/auth/types';
import ErrorMessage from '@components/common/ErrorMessage/ErrorMessage';

require('../common/styles/antdForm.css');

const FormItem = Form.Item;

export interface SignUpFormProps {
  form: WrappedFormUtils;
  loading: boolean;
  error: string;
  signUp: SignUpSignature;
}

class SignUpForm extends React.Component<SignUpFormProps> {

  handleSubmit = (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();

    const {
      form: { validateFields },
      signUp,
    } = this.props;

    validateFields((errors, values) => {
      if (!errors) {
        signUp(values);
      }
    })
  }

  render() {
    const {
      error,
      form: { getFieldDecorator },
      loading,
    } = this.props;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 50 }}>
        {error.length > 0 && <ErrorMessage message={error} />}
        <Form onSubmit={this.handleSubmit} style={{ width: 300 }}>
          <h1 style={{ textAlign: 'center' }}>Sign up form</h1>
          {
            loading
              ? <Spin size='large' style={{ display: 'flex', justifyContent: 'center' }} />
              : null
          }
          <FormItem>
            {
              getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your name'
                  }
                ]
              })(
                <Input
                  placeholder='Input your name'
                  prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                />)
            }
          </FormItem>
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
                <Input
                  placeholder='Input your email'
                  prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                />)
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
                <Input
                  type='password'
                  placeholder='Input your password'
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                />)
            }
          </FormItem>
          <FormItem>
            <Button
              htmlType='submit'
              type='primary'
              style={{ width: '100%' }}
            >
              Sign up
             </Button>
          </FormItem>
          <FormItem style={{ marginTop: '-10px' }}>
            Or
            <Link to='/signin'> sign in!</Link>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(SignUpForm);