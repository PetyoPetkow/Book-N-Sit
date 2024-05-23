import { Button, Checkbox, Form, FormProps, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { FC, useState } from 'react';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { FirebaseError } from 'firebase/app';
import { generateFirebaseAuthErrorMessage } from '../../firebase/errorHandler';
import { useNavigate } from 'react-router-dom';

const LoginPage: FC<LoginPageProps> = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const { email, password } = values;

    if (email !== undefined && password !== undefined) {
      try {
        await doSignInWithEmailAndPassword(email, password);
        navigate('/Places');
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
          <div className="text-white text-5xl bold">Login</div>
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
            <Input size="large" prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="float-right" href="">
              Forgot password
            </a>
          </Form.Item>

          {errorMsg && (
            <Form.Item>
              <div className="text-red-600">{errorMsg}</div>
            </Form.Item>
          )}

          <Form.Item>
            <Button className="w-full" size="large" type="primary" htmlType="submit">
              Log in
            </Button>
            Or <a href="">register now!</a>
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

interface LoginPageProps {}

export default LoginPage;
