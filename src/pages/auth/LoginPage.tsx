import { FC, useState } from 'react';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { FirebaseError } from 'firebase/app';
import { generateFirebaseAuthErrorMessage } from '../../firebase/errorHandler';
import { NavLink, useNavigate } from 'react-router-dom';
import PasswordTextField from './components/PasswordTextField';
import EmailTextField from './components/EmailTextField';
import { useTranslation } from 'react-i18next';
import AuthFormFrame from './AuthFormFrame';

const LoginPage: FC<LoginPageProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate('/all');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMsg(generateFirebaseAuthErrorMessage(error));
      }
    }
  };

  return (
    <AuthFormFrame
      title={t('login')}
      submitBtnLabel={t('log_in_btn')}
      redirectLinkLabel={t('register_now_link')}
      redirectPath="/register"
      errorMsg={errorMsg}
      onSubmit={onLogin}
    >
      <EmailTextField onChange={(event) => setEmail(event.target.value)} />
      <PasswordTextField onChange={(event) => setPassword(event.target.value)} />
      <NavLink className="ml-auto text-[#028391] no-underline" to="/resetPassword">
        {t('forgot_password_link')}
      </NavLink>
    </AuthFormFrame>
  );
};

interface LoginPageProps {}

export default LoginPage;
