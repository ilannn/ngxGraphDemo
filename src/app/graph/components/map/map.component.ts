import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphService } from '../../services/graph/graph.service';
import { Subscription } from 'rxjs';
import { MapSchema } from '../../models/map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map') map: ElementRef;
  private sub: Subscription = new Subscription();
  mapState: Partial<MapSchema> = {};

  constructor(private graphService: GraphService) { }

  ngOnInit() {
    this.sub.add(this.graphService.getMap().subscribe((map) => {
      this.mapState = { ...map };
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    // this.openFullscreen();
  }

  private openFullscreen(): void {
    // this.isFullscreen = true;
    const el = this.map.nativeElement;

    if (!el.fullscreenElement &&    // alternative standard method
      !el.mozFullScreenElement && !el.webkitFullscreenElement) {  // current working methods
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    }
  }

  

}
