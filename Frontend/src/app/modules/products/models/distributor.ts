import { Team } from "../../company/models/team";

export interface Distributor {
  id: number;
  distributorName : string,
  address1 : string,
  address2 : string,
  state : string,
  phoneNumber : string,
  gstNo : string,
  panNo : string,
  contactPerson : string,
  fssaiNo : string,
  brokerage: boolean;
  advance: boolean;
  unloading: boolean;
  team: Team
  status: string,

  cloudinaryId : string
  fileUrl : string
}
