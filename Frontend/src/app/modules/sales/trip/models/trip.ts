import { Route } from "../../route/models/route"

export interface Trip{
    id : number
    routeId : number
    route : Route
    date  : Date
    driver : string
    salesMan : string
    status : boolean
    branchId : number
}
