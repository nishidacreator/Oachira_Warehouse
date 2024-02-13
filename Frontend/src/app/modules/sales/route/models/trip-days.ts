import { Route } from "./route";

export interface TripDays {
  id: number;
  routeId: number;
  route: Route;
  status: boolean;
  weekDay: string;
}
