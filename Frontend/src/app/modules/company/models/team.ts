import { OperatorFunction } from "rxjs";
// import { User } from "../../auth/models/register";
import { User } from "../../users/models/user"
import { TeamMember } from "./teamMembers";


export interface Team {
    filiter(arg0: OperatorFunction<any, any>): any;
    pipe(arg0: OperatorFunction<any, any>): any;
    map(arg0: (x: any) => any): any;
    id:string;
    teamName: string;
    userId: number;
    teamMembers: TeamMember
    user: User
}
