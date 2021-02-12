import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GraphService } from '../../services/graph/graph.service';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { MapSchema } from '../../models/map.model';
import { ExpandableNode } from '../../models/node.model';
import { ClusterNode, GraphComponent } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('graph') private graph: GraphComponent;
  private sub: Subscription = new Subscription();
  mapState: Partial<MapSchema> = {};
  focusedNode$: Subject<string> = new Subject();
  
  private _mapUpdate$: Subject<boolean>;
  private _mapCenter$: Subject<boolean>;
  mapUpdate$: Observable<boolean>;
  mapCenter$: Observable<boolean>;

  constructor(private graphService: GraphService) {
    this._mapUpdate$ = this.graphService.mapUpdate$;
    this.mapUpdate$ = this._mapUpdate$.asObservable();
    this._mapCenter$ = this.graphService.mapCenter$;
    this.mapCenter$ = this._mapCenter$.asObservable();
  }

  ngOnInit() {
    this.sub.add(this.graphService.getMap().subscribe((map) => {
      this.mapState = {
        ...this.mapState,
        ...map
      }
      this._mapUpdate$.next(true);
    }));
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNodeClicked(node: ExpandableNode) {
    // console.log(node);
    this.graphService.openNode(node, this.graph.graph, this.graph.links);
    // this.focusedNode$.next(node.id);
  }

  onClusterClicked(cluster: ClusterNode) {
    // console.log("Clicked!", cluster);
    this.graphService.closeContainer(cluster, this.graph.graph, this.graph.links);
    // this.focusedNode$.next(cluster.id);
  }

  logMapState(graph: any) {
    console.log(graph.graph);
  }

  centerGraph() {
    this._mapCenter$.next(true);
  }
}
