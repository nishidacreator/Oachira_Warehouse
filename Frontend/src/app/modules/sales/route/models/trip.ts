import { Customer } from "../../customers/models/customer";
import { Route } from "./route";
import { TripDetails } from "./trip-details";

export interface Trip {
  id: number;
  routeId: number;
  route: Route;
  status: string;
  date: Date;
  driver: string;
  salesMan: string;
  tripDetails: TripDetails[]
}

