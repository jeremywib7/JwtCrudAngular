export interface User {
  username: string;
  userFirstName: string;
  userLastName: string;
  userPassword: string;
  email: string;
  role: {
    roleName: string;
    roleDescription: string;
  }
  gender: string;
  dateJoined: string;
  phoneNumber: string;
  address: string;
  imageUrl: string;
  userCode: string;
  bankAccount: string;
}
