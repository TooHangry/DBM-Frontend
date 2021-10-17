import { Item } from "./item.models";

export interface Home {
    id: number;
    nickname: string;
    isAdmin: boolean;
}

export interface HomeInfo extends Home{
    categories: string[];
    items: Item[];
}

export interface HomeToAdd {
    nickname: string;
    invites: string[];
}