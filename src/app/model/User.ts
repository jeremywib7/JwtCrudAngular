export interface User {
  username: string;
  userFirstName: string;
  userLastName: string;
  lastName: string;
  email: string;
  role: {
    [key: string]: Role
  }
  gender: string;
  dateJoined: string;
  phoneNumber: string;
  address: string;
  imageUrl: string;
  userCode: string;
  bankAccount: string;
}

interface Role {
  roleName?: string;
  roleDescription?: string;
  role: User[];
}

