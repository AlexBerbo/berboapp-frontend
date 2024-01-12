
export interface Invoice {
    id: number;
    invoiceNumber: string;
    services: string;
    total: number;
    createdAt: Date;
}