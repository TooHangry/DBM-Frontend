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
}

export interface NewList {
    title: string;
    email: string;
    endDate: string
}