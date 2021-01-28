import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { GraphService } from './services/graph/graph.service';
import { MapComponent } from './components/map/map.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NodeComponent } from './node/node.component';

@NgModule({
  declarations: [MapComponent, NodeComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    NgxGraphModule,
  ],
  providers: [GraphService],
  exports: [MapComponent]
})
export class GraphModule { }
