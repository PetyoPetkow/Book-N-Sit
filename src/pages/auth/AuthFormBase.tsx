import { Button, Divider } from '@mui/material';
import { FC, ReactNode } from 'react';
import { NavLink, Path } from 'react-router-dom';

const AuthFormBase: FC<AuthFormBaseProps> = ({
  children,
  onSubmit,
  title,
  submitBtnLabel,
  redirectLinkLabel,
  redirectPath,
  errorMsg,
  forgotPasswordlabel,
  disabled,
}) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <div className="w-[500px] overflow-hidden bg-white shadow-gray-500 shadow-md">
        <div className="h-20 font-bold text-[#028391] text-5xl font-sans flex items-center justify-center">
          {title}
        </div>
        <Divider className="mx-4" />
        <div className="p-10 pt-20">
          <div className="flex flex-col gap-10">{children}</div>
          <div className="flex flex-col">
            {forgotPasswordlabel && (
              <NavLink className="ml-auto text-[#028391] no-underline" to="">
                {forgotPasswordlabel}
              </NavLink>
            )}
            {errorMsg && <div className="text-red-500 text-center mt-4">{errorMsg}</div>}
            <Button
              disabled={disabled}
              className="mt-12 bg-[#028391] hover:bg-[#60b6c0]"
              size="large"
              variant="contained"
              onClick={onSubmit}
            >
              {submitBtnLabel}
            </Button>

            <NavLink className="text-[#028391] no-underline mt-2" to={redirectPath}>
              {redirectLinkLabel}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AuthFormBaseProps {
  children: ReactNode;
  onSubmit: () => void;
  title: string;
  submitBtnLabel: string;
  redirectLinkLabel: string;
  redirectPath: string;
  errorMsg: string | null;
  disabled?: boolean;
  forgotPasswordlabel?: string;
}

export default AuthFormBase;
