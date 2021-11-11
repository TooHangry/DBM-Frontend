import { Item } from "./item.models";

export interface List {
    id: number;
    title: string;
    taskedUserID: number;
    items: Item[];
    dateTasked: string;
    dateDue: string;
    isComplete: boolean;
}

export interface NewList {
    title: string;
    email: string;
    startDate: string;
    endDate: string
}