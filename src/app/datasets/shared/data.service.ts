import { Injectable } from '@angular/core';
import { DateService } from './date.service';
import {
    Datagroup,
    Dataset
} from './';

@Injectable()
export class DataService {
    constructor(
        private dateService: DateService
    ) {}

    addNewDatagroup(datagroups: Datagroup[]): void {
        let newDatagroup: Datagroup = {
            id: this.getLatestDatagroupId(datagroups) + 1,
            title: 'Titel',
            description: '',
            datasets: []
        }
        datagroups.unshift(newDatagroup);
    }

    addNewDataset(datagroup: Datagroup, datagroups: Datagroup[]): void {
        let newDataset: Dataset = {
            id: this.getLatestDatasetId(datagroups) + 1,
            groupID: datagroup.id,
            title: '',
            billingCycle: 'year',
            creationDate: new Date().getTime(),
            lastModifiedDate: 0,
            chargeDate: new Date().getTime(),
            updateValue: 0.00,
            amountTotal: 0,
            currentValue: 0,
            targetValue: 0,
            diffValue: 0,
            monthlyShare: 0,
        }
        datagroup.datasets.unshift(newDataset);
    }

    getLatestDatagroupId(datagroups: Datagroup[]): number {
        let ids = [1];
        datagroups.forEach(datagroup => {
            ids.push(datagroup.id);
        });
        return Math.max.apply(Math, ids);
    }

    getLatestDatasetId(datagroups: Datagroup[]): number {
        let ids = [1];
        datagroups.forEach(datagroup => {
            datagroup.datasets.forEach(dataset => {
                ids.push(dataset.id);
            });
        });
        return Math.max.apply(Math, ids);
    }

    deleteDatagroup(datagroup: Datagroup, datagroups: Datagroup[]): void {
        let i = datagroups.indexOf(datagroup);
        datagroups.splice(i, 1);
    }

    deleteDataset(dataset: Dataset, datagroup: Datagroup): void {
        let i = datagroup.datasets.indexOf(dataset);
        datagroup.datasets.splice(i, 1);
    }

    updateValues(dataset: Dataset): void {
        if(dataset.updateValue == undefined) return;

        dataset.currentValue += +dataset.updateValue;

        if(dataset.billingCycle !== '') {
            this.calcTargetValue(dataset);
        }

        this.calcDiffValue(dataset);
        this.updateModificationDate(dataset);
        dataset.updateValue = 0;
    }

    calcTargetValue(dataset: Dataset): void {
        var cycleMonth;

        switch(dataset.billingCycle) {
            case 'quarter':
                cycleMonth = 3;
                break;
            case 'year':
                cycleMonth = 12;
                break;
            case '2years':
                cycleMonth = 24;
                break;
        }

        let d1 = new Date(dataset.chargeDate);
        let d2 = new Date();
        let monthsBetween = this.dateService.getMonthBetween(d1, d2) + 1;
        dataset.targetValue = monthsBetween % cycleMonth * (dataset.amountTotal / cycleMonth);
        this.updateModificationDate(dataset);
    }

    calcDiffValue(dataset: Dataset): void {
        dataset.diffValue = dataset.currentValue - dataset.targetValue;
        this.updateModificationDate(dataset);
    }

    updateModificationDate(dataset: Dataset): void {
        dataset.lastModifiedDate = new Date().getTime();
    }
}