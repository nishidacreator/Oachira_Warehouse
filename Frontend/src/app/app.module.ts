import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';
// import { BoldReportDesignerModule  } from '@boldreports/angular-reporting-components';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DeleteDialogueComponent } from './Modules/shared-components/delete-dialogue/delete-dialogue.component';
// import { TokenInterceptor } from './Modules/shared-components/interceptors/token.interceptor';
// Report viewer
// import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';

// data-visualization
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';
import { TokenInterceptor } from './modules/shared-components/interceptors/token.interceptor';
// import { TestReportComponent } from './Modules/admin/test-report/test-report.component';
// import { TestPrintComponent } from './Modules/admin/test-print/test-print.component';

@NgModule({
  declarations: [
    AppComponent
    // DeleteDialogueComponent,
    // TestReportComponent,
    // TestPrintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // BoldReportViewerModule,
    // BoldReportDesignerModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
