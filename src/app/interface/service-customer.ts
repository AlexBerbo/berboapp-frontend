import { Invoice } from "./invoice";

export interface ServiceCustomer {
    id: number;
    serviceCustomerNumber: string;
    name: string;
    price: number;
    fee: number;
    invoice?: Invoice;
}