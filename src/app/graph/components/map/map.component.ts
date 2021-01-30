import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphService } from '../../services/graph/graph.service';
import { Subscription } from 'rxjs';
import { MapSchema } from '../../models/map.model';
import { ExpandableNode } from '../../models/node.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('map') map: ElementRef;
  private sub: Subscription = new Subscription();
  mapState: Partial<MapSchema> = {};

  constructor(private graphService: GraphService) { }

  ngOnInit() {
    this.sub.add(this.graphService.getMap().subscribe((map) => {
      console.log(map);
      this.mapState = { ...map };
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNodeClicked(node: ExpandableNode) {
    console.log(node);
    this.graphService.openNode(node);
  }

}
