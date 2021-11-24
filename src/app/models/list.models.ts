import { Item } from "./item.models";

export interface List {
    id: number;
    title: string;
    taskedUser: number;
    taskedUserEmail?: string;
    items: Item[];
    dateTasked: string;
    dateDue: string;
    isComplete: boolean;
    homeID: number;
    homeName: string;
}

export interface NewList {
    title: string;
    email: string;
    endDate: string
}