import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphModule } from './graph/graph.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GraphModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
