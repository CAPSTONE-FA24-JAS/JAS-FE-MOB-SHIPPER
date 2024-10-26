export interface AuthType {
  user: {
    id: number; // Changed to number for flexibility
    email: string;
    phoneNumber: string;
    gender: string | null; // Gender can be nullable
    passwordHash: string;
    roleId: number;
    roleName: string;
    customerDTO: CustomerDTO | null; // Nullable customerDTO
    staffDTO: StaffDTO | null; // Nullable staffDTO
  };
  accessToken: string;
}

export interface CustomerDTO {
  // Define the structure if needed
}

export interface StaffDTO {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  gender: string;
  dateOfBirth: string; // Use string for ISO date format
  accountDTO: AccountDTO | null; // Nullable accountDTO
}

export interface AccountDTO {
  // Define the structure if needed
}
