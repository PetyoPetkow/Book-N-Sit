import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC, useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';

const EmailTextField: FC<EmailTextFieldProps> = (props) => {
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);

  const { t } = useTranslation();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    setIsEmailInvalid(!isEmailValid);
  };

  return (
    <TextField
      type="email"
      label={t('email')}
      size="small"
      variant="filled"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle className="text-white" />
          </InputAdornment>
        ),
      }}
      error={isEmailInvalid}
      helperText={isEmailInvalid && t('register_email_validation')}
      onBlur={(event) => {
        validateEmail(event.target.value);
      }}
      {...props}
    />
  );
};

type EmailTextFieldProps = Omit<TextFieldProps, 'type' | 'label'>;

export default EmailTextField;
