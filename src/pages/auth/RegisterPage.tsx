import { Button, Checkbox, Form, FormProps, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { FC, useState } from 'react';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { FirebaseError } from 'firebase/app';
import { generateFirebaseAuthErrorMessage } from '../../firebase/errorHandler';

const RegisterPage: FC<RegisterPageProps> = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log(values);
    const { email, password } = values;

    if (email !== undefined && password !== undefined) {
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        setErrorMsg(null);
      } catch (error) {
        if (error instanceof FirebaseError) {
          setErrorMsg(generateFirebaseAuthErrorMessage(error));
        }
      }
    }
  };

  return (
    <div className="h-[calc(100vh-46px)] flex items-center justify-center">
      <div className="my-28 mx-14 ">
        <div className="flex justify-center items-center h-20 bg-[#561C24] ">
          <div className="text-white text-5xl bold">Register</div>
        </div>
        <Form
          name="normal_login"
          className="w-[400px] my-28 mx-20"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
            <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The new password that you entered do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>

          {errorMsg && (
            <Form.Item>
              <div className="text-red-600">{errorMsg}</div>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              className="w-full bg-[#6D2932] hover:bg-[#561C24]!important"
              size="large"
              type="primary"
              htmlType="submit"
            >
              Sign up
            </Button>
            Already have an account? <a href="">Login here</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

interface RegisterPageProps {}

export default RegisterPage;
