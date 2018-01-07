import 'rxjs/add/operator/switchMap';
import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { DatasetsComponent } from '../datasets.component';
import { Dataset } from '../shared/dataset.model';
import { DataService } from '../shared/data.service';
import { DateService } from '../shared/date.service';

@Component({
    moduleId: module.id,
    selector: 'dataset-details',
    templateUrl: './dataset-details.component.html',
    styleUrls: ['../dataset-list/dataset-list.component.scss']
})
export class DatasetDetailsComponent implements OnInit {
    @Input() dataset: Dataset;
    @Output() closeDetailView = new EventEmitter();

    constructor(
        // private dataService: DataService,
        // private dateService: DateService
    ) {}

    ngOnInit(): void {}

    goToList(dataset: Dataset): void {
        this.closeDetailView.emit();
    }
}