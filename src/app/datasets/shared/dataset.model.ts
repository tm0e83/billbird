export class Dataset {
    id: number;
    groupID: number;
    title: string;
    description?: string;
    billingCycle: string;
    creationDate: number;
    lastModifiedDate: number;
    chargeDate: number;
    expireDate?: string;
    updateValue?: number;
    amountTotal: number = 0;
    currentValue: number = 0;
    targetValue: number = 0;
    diffValue: number = 0;
    monthlyShare: number = 0;
}