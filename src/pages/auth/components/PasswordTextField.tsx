import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC, useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordTextField: FC<PasswordTextFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      label="Password"
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
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

type PasswordTextFieldProps = Omit<TextFieldProps, 'type'>;

export default PasswordTextField;
