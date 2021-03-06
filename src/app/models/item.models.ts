export interface Item {
    id?: number,
    item: string;
    quantity: number;
    category: string;
    alertThreshold: number;
    isInAList: boolean;
    needed: number;
}