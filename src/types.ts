import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Options {
    options: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        context?: HttpContext;
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        };
        reportProgress?: boolean;
        responseType?: "json";
        withCredentials?: boolean;
        transferCache?: {
            includeHeaders?: string[];
        } | boolean;
    }
}

export interface Product {
    productId?: number;
    productCategory: string;
}

export interface ProductDetail {
    productDetailId?: number;
    productId: number;
    productCategory: string;
    variant: string;
}

export interface Supplier {
    supplierId?: number;
    supplierName: string;
    dues: number;
}

export interface Size {
    sizeId?: number;
    sizeInMM: number;
}

export interface ProductStock {
    productStockId?: number;
    productDetailId: number;
    variant: string;
    gsm?: number;
    sizeId?: number;
    sizeInMM?: number;
    weightInKgs: number;
    rollCount?: number;
}

export interface Receipt {
    receiptId?: number;
    receiptDate: string;
    supplierId: number;
    supplierName: string;
    billNo: string;
    billDate: string;
    billValue: number;
    receiptDetails: ReceiptDetail[]
}

export interface ReceiptDetail {
    receiptDetailId?: number;
    receiptId: number;
    productStockId: number;
    weight: number;
    unitRate: number;
    rollCount: number;
}

export interface RollNumber {
    rollNumberId?: number;
    receiptDetailId: number;
    rollNumberValue: string;
}

export interface Issue {
    issueId?: number;
    issueDate: string;
    rollNumberId: number;
    productStockId: number;
    rollNumber: string;
    weight: number;
    moisture: number;
}

export interface ProductionCoating {
    productionCoatingId?: number;
    productionCoatingDate: string;
    issueId: number;
    coatingStart: string;
    coatingEnd: string;
    averageSpeed: number;
    averageTemperature: number;
    gsmCoated: number;
    rollCount: number;
}

export interface ProductionCalendaring {
    productionCalendaringId?: number;
    productionCoatingDate: string;
    productionCoatingId: number;
    rollNumber: string;
    beforeWeight: number;
    beforeMoisture: number;
    calendaringStart: string;
    calendaringEnd: string;
    rollCount: number;
}

export interface ProductionSlitting {
    productionSlittingId?: number;
    productionCoatingDate: string;
    productionCalendaringId: number;
    rollNumber: string;
    beforeWeight: number;
    beforeMoisture: number;
    slittingStart: string;
    slittingEnd: string;
    rollCount: number;
}

export interface SlittingDetail {
    slittingDetailId?: number;
    productionSlittingId: number;
    rollNumber: string;
    weight: number;
    moisture: number;
}