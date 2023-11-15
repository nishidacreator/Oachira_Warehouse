import { Role } from './role';
export interface User{
  id: number
  name: string,
  phoneNumber: string,
  password: string,
  roleId: number,
  role: Role
  status: boolean
  token : string
  branchId : number
}
