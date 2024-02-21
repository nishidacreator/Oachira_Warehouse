import { Component, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExcelExportService, GridComponent, PageService, PdfExportProperties, PdfExportService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
  providers: [
    ToolbarService,
    PageService,
    ExcelExportService,
    PdfExportService,
  ],
})
export class TripListComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


}
