export type AuthRole = 'user' | 'moderator';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: AuthRole;
  created_at: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  user: AuthUser;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}
