
export interface Invoice {
    id: number;
    invoiceNumber: string;
    serviceName: string;
    status: string;
    total: number;
    createdAt: Date;
}