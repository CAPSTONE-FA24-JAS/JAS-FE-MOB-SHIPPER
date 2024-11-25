// types/authTypes.ts

export interface UserAccount {
  address?: {};
  lastName?: string;
  firstName?: string;
  // walletId?: number;

  id: number;
  email: string | null;
  phoneNumber: string;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: CustomerDTO;
  staffDTO?: any;
}

export interface CustomerDTO {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  citizenIdentificationCard: string;
  idIssuanceDate: string;
  idExpirationDate: string;
  priceLimit: any;
  expireDate: any;
  walletId: number;
  walletDTO: walletDTO;
  accountDTO: any;
}

interface walletDTO {
  id: number;
  balance: number;
  customerDTO: any;
}

export interface Data {
  user: UserAccount;
  accessToken: string;
}

export default {};
