import { FC, useState } from 'react';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { FirebaseError } from 'firebase/app';
import { generateFirebaseAuthErrorMessage } from '../../firebase/errorHandler';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Divider } from '@mui/material';
import PasswordTextField from './components/PasswordTextField';
import EmailTextField from './components/EmailTextField';

const LoginPage: FC<LoginPageProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate('/Places');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMsg(generateFirebaseAuthErrorMessage(error));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <div className="w-[500px] overflow-hidden bg-white shadow-gray-500 shadow-md">
        <div className="h-20 font-bold text-[#028391] text-5xl font-sans flex items-center justify-center">
          Login
        </div>
        <Divider className="mx-4" />
        <div className="p-10 pt-20">
          <div className="flex flex-col gap-10">
            <EmailTextField onChange={(event) => setEmail(event.target.value)} />
            <PasswordTextField onChange={(event) => setPassword(event.target.value)} />
          </div>
          <div className="flex flex-col">
            <NavLink className="ml-auto text-[#028391] no-underline" to="">
              Forgot password
            </NavLink>
            {errorMsg && <div className="text-red-500 text-center mt-4">{errorMsg}</div>}
            <Button
              className="mt-12 bg-[#028391] hover:bg-[#60b6c0]"
              size="large"
              variant="contained"
              onClick={onLogin}
            >
              Log in
            </Button>
            <div>
              Or{' '}
              <NavLink className="text-[#028391] no-underline" to="">
                Register now!
              </NavLink>
            </div>
          </div>
        </div>
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
