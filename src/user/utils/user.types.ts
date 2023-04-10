export type SignupParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  jobRole: string;
  department: string;
  address: string;
  isAdmin: boolean;
};

export type JwtToken = {
  isAdmin: boolean;
  email: string;
  id: number;
};

export type LoginParams = {
  email: string;
  password: string;
};

export interface UserInfo {
  email: string;
  id: number;
  isAdmin: boolean;
  iat: Date;
  exp: Date;
}
