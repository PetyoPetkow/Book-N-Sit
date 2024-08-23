import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC, useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';

const PasswordTextField: FC<PasswordTextFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { t } = useTranslation();

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      label={t('password')}
      size="small"
      variant="filled"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOpenIcon className="text-white" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(event) => event.preventDefault()}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

type PasswordTextFieldProps = Omit<TextFieldProps, 'type'>;

export default PasswordTextField;
