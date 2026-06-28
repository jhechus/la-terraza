export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}
