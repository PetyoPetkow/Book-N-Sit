import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC, useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';

const EmailTextField: FC<EmailTextFieldProps> = (props) => {
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    setIsEmailInvalid(!isEmailValid);
  };

  return (
    <TextField
      type="email"
      label="Email"
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
      helperText={isEmailInvalid && 'Please enter a valid email!'}
      onBlur={(event) => {
        validateEmail(event.target.value);
      }}
      {...props}
    />
  );
};

type EmailTextFieldProps = Omit<TextFieldProps, 'type' | 'label'>;

export default EmailTextField;
