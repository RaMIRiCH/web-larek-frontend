export interface IProduct {
    id: string;
    title: string;
    category: string;
    description?: string;
    image: string;
    price: number | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export type ApiListResponse<T> = {
    total: number;
    items: T[];
};