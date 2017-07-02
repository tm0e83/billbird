import {
    Component,
    OnInit,
    Input,
    EventEmitter,
    Output
} from '@angular/core';
import { Datagroup, Dataset } from '../shared';
import { DataService } from '../shared/data.service';
import { DateService } from '../shared/date.service';

@Component({
    selector: 'dataset-list',
    templateUrl: './dataset-list.component.html',
    styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {
    selectedDatagroup: Datagroup;
    selectedDataset: Dataset;
    sum: number = 0;
    @Input() datagroups: Datagroup[];
    @Output() datasetSelected = new EventEmitter();

    constructor(
        private dataService: DataService,
        private dateService: DateService
    ) {}

    ngOnInit(): void {
    }

    addNewDatagroup(): void {
        this.dataService.addNewDatagroup(this.datagroups);
    }

    addNewDataset(): void {
        if(this.selectedDatagroup) {
            this.dataService.addNewDataset(this.selectedDatagroup, this.datagroups);
        }
    }

    deleteDatagroup(): void {
        if(this.selectedDatagroup) {
            this.dataService.deleteDatagroup(this.selectedDatagroup, this.datagroups);
        }
    }

    deleteDataset(): void {
        if(this.selectedDataset && this.selectedDatagroup) {
            this.dataService.deleteDataset(this.selectedDataset, this.selectedDatagroup);
        }
    }

    onSelectDataset(dataset: Dataset): void {
        this.selectedDataset = dataset;
    }

    onSelectDatagroup(datagroup: Datagroup): void {
        this.selectedDatagroup = datagroup;
    }

    gotoDetail(dataset: Dataset): void {
        this.selectedDataset = dataset;
        this.datasetSelected.emit(this.selectedDataset);
    }

    currencyToNumber(currencyString: string): number {
        return parseFloat(currencyString.replace(/(\s€)|\./, '').replace(',', '.')) || 0;
    }

    updateSum(): void {
        this.sum = 0;
        this.datagroups.forEach(group => {
            group.datasets.forEach(set => {
                this.sum += set.updateValue;
            });
        });
    }
}