import { User } from "src/app/modules/users/models/user"
import { Vehicle } from "./vehicle"

export interface Route {
  id : number,
  routeName : string,
  vehicleId  :number,
  vehicle : Vehicle
  driverId : number,
  driver : User
  salesManId : number
  salesMan : User
  salesExecutiveId : number
  status : boolean
}
