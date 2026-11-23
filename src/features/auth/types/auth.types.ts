export type UserRole = "Student" | "Admin" | "SuperAdmin";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  studentId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  contactNumber: string | null;
  studentId: string | null;
  role: UserRole;
  isActive: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  user: User;
  accessToken: string;
}


export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}
