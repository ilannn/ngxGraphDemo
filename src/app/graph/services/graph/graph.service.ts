import { Injectable } from '@angular/core';
import { MapSchema } from '../../models/map.model';
import { Observable, of } from 'rxjs';
import { NodeType } from '../../models/node.model';

@Injectable()
export class GraphService {

  constructor() { }

  getMap(): Observable<MapSchema> {
    return of(<MapSchema>{
      links: [
        {
          id: 'a',
          source: 'first',
          target: 'second',
          label: 'is parent of'
        }, {
          id: 'b',
          source: 'first',
          target: 'c1',
          label: 'custom label'
        }, {
          id: 'd',
          source: 'first',
          target: 'c2',
          label: 'custom label'
        }, {
          id: 'e',
          source: 'c1',
          target: 'd',
          label: 'first link'
        }, {
          id: 'f',
          source: 'c1',
          target: 'd',
          label: 'second link'
        }
      ],
      nodes: [
        {
          id: 'first',
          label: 'A',
          type: NodeType.A
        }, {
          id: 'second',
          label: 'B',
          type: NodeType.B
        }, {
          id: 'c1',
          label: 'C1',
          type: NodeType.C
        }, {
          id: 'c2',
          label: 'C2',
          type: NodeType.C
        }, {
          id: 'd',
          label: 'D'
        }
      ]
    })
  }
}
