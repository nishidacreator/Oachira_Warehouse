import { Role } from './role';
import { Token } from './token';
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
