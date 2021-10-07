import { Home } from "./home.models";

export interface User {
    id: number;
    email: string;
    fname: string;
    lname: string;
    dateJoined: Date;
    token: string;
    homes?: Home[];
    categories: string[];
}