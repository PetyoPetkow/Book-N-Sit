import { FC, useState } from 'react';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { FirebaseError } from 'firebase/app';
import { generateFirebaseAuthErrorMessage } from '../../firebase/errorHandler';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import PasswordTextField from './components/PasswordTextField';
import EmailTextField from './components/EmailTextField';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';

const RegisterPage: FC<RegisterPageProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordMismatch, setIsPasswordMismatch] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onRegister = async () => {
    try {
      const { user } = await doCreateUserWithEmailAndPassword(email, password);

      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        language: 'en',
        displayName: user.email!.split('@')[0],
        photoURL: '',
        phoneNumber: '',
      });

      setErrorMsg(null);
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
          Register
        </div>
        <div className="p-10 pt-20">
          <div className="flex flex-col gap-10">
            <EmailTextField onChange={(event) => setEmail(event.target.value)} />
            <PasswordTextField onChange={(event) => setPassword(event.target.value)} />
            <PasswordTextField
              error={isPasswordMismatch}
              onBlur={() => {
                if (confirmPassword !== '' && password !== confirmPassword) {
                  setIsPasswordMismatch(true);
                } else {
                  setIsPasswordMismatch(false);
                }
              }}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
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
              onClick={onRegister}
            >
              Sign up
            </Button>
            <div>
              Already have an account?{' '}
              <NavLink className="text-[#028391] no-underline" to="">
                Login here
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

interface RegisterPageProps {}

export default RegisterPage;
