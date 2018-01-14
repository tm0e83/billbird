export interface Dataset {
  id: number;
  title: string;
  active: boolean;
  description?: string;
  billingCycle: string;

  creationDate: number;
  lastModifiedDate: number;
  chargeDate: number;
  validFromDate?: number;
  expireDate?: number;

  updateValue?: number;
  currentValue: number;
  billingValue: number;
  targetValue: number;
  diffValue: number;
  monthlyShare: number;
}