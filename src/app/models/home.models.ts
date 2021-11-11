import { Item } from "./item.models";

export interface Home {
    id: number;
    nickname: string;
    isAdmin: boolean;
}

export interface HomeInfo extends Home{
    categories: string[];
    items: Item[];
    users: Member[];    
    invites: Invite[];
    admin: string;
}

export interface HomeToAdd {
    nickname: string;
    invites: string[];
}

export interface Invite {
    home: number;
    email: string;
}

export interface Member {
    id: number;
    fname: string;
    lname: string;
    email: string;
}