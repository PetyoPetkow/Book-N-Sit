import { FC, useState } from 'react';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { FirebaseError } from 'firebase/app';
import { generateFirebaseAuthErrorMessage } from '../../firebase/errorHandler';
import PasswordTextField from './components/PasswordTextField';
import EmailTextField from './components/EmailTextField';
import { createUserInDB } from '../../firebase/services/UserService';
import { useTranslation } from 'react-i18next';
import AuthFormBase from './AuthFormBase';

const RegisterPage: FC<RegisterPageProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordMismatch, setIsPasswordMismatch] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { t } = useTranslation();

  const onRegister = async () => {
    try {
      const { user } = await doCreateUserWithEmailAndPassword(email, password);

      await createUserInDB({
        id: user.uid,
        language: 'en',
        displayName: user.email!.split('@')[0],
      });

      setErrorMsg(null);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMsg(generateFirebaseAuthErrorMessage(error));
      }
    }
  };

  return (
    <AuthFormBase
      title={t('register')}
      submitBtnLabel={t('sign_up_btn')}
      redirectLinkLabel={t('login_here_link')}
      redirectPath="/Login"
      errorMsg={errorMsg}
      onSubmit={onRegister}
      disabled={isPasswordMismatch}
    >
      <EmailTextField onChange={(event) => setEmail(event.target.value)} />
      <PasswordTextField onChange={(event) => setPassword(event.target.value)} />
      <PasswordTextField
        label={t('confirm_password')}
        error={isPasswordMismatch}
        onBlur={() => {
          if (password !== confirmPassword) {
            setIsPasswordMismatch(true);
          } else {
            setIsPasswordMismatch(false);
          }
        }}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
    </AuthFormBase>
  );
};

interface RegisterPageProps {}

export default RegisterPage;
