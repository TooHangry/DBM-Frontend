import { Item } from "./item.models";

export interface List {
    id: number;
    title: string;
    taskedUserID: number;
    items: Item[];
    dateTasked: Date;
    dateDue: Date;
    isComplete: boolean;
}