import { FC, useState } from 'react';
import { doSendPasswordResetEmail } from '../../firebase/auth';
import { FirebaseError } from 'firebase/app';
import { generateFirebaseAuthErrorMessage } from '../../firebase/errorHandler';
import EmailTextField from './components/EmailTextField';
import { useTranslation } from 'react-i18next';
import AuthFormFrame from './AuthFormFrame';
import { toast, ToastContainer } from 'react-toastify';

const ResetPasswordPage: FC<ResetPasswordPageProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { t } = useTranslation();

  const onPasswordReset = async () => {
    try {
      await doSendPasswordResetEmail(email);
      toast(t('reset_password_check_email'));
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMsg(generateFirebaseAuthErrorMessage(error));
      }
    }
  };

  return (
    <AuthFormFrame
      title={t('reset_password')}
      submitBtnLabel={t('btn_submit')}
      errorMsg={errorMsg}
      onSubmit={onPasswordReset}
    >
      <EmailTextField onChange={(event) => setEmail(event.target.value)} />
      <ToastContainer position="bottom-center" />
    </AuthFormFrame>
  );
};

interface ResetPasswordPageProps {}

export default ResetPasswordPage;
