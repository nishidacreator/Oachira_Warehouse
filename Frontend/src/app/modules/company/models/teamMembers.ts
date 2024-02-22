
import { User } from "../../users/models/user";
import { Team } from "./team";

export interface TeamMember {
    name: any;
    filter(arg0: (x: TeamMember) => any): unknown;
    id:string;
    teamId: number;
    userId: number;

    team: Team
    user: User
}
