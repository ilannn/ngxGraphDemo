import { Injectable } from '@angular/core';
import { MapSchema } from '../../models/map.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ExpandableNode, NodeType, TypedNode } from '../../models/node.model';
import { ClusterNode, Node, Edge } from '@swimlane/ngx-graph';
import { ExpandableEdge } from '../../models/edge.model';

@Injectable()
export class GraphService {

  private mapState$: BehaviorSubject<MapSchema>;
  private mapUpdate$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.initMapState();
  }

  private initMapState() {
    this.mapState$ = new BehaviorSubject<MapSchema>({
      links: [
        {
          id: 'a',
          source: 'first',
          target: 'second',
          label: 'is parent of',
          data: {
            child_source_id: 'child1',
          }
        }, {
          id: 'b',
          source: 'first',
          target: 'c1',
          label: 'custom label',
          data: {
            child_source_id: 'child1',
          }
        }, {
          id: 'd',
          source: 'first',
          target: 'c2',
          label: 'custom label',
          data: {
            child_source_id: 'child1',
          }
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
          type: NodeType.A,
          meta: {
            children: [
              {
                id: 'child1',
                label: 'Child-1',
                type: NodeType.C,
              },
              {
                id: 'child2',
                label: 'Child-2',
                type: NodeType.C,
              }
            ]
          }
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
      ],
      clusters: [
        {
          id: 'third',
          label: 'Cluster node',
          childNodeIds: ['c1', 'c2']
        }
      ]
    })
  }

  private turnNodeToContainer(node: ExpandableNode): ClusterNode {
    /* Open the given node to a container and return a cluster node */
    const meta = { ...node.meta, children: undefined, forceDimensions: true };
    return <ClusterNode>{
      ...node,
      childNodeIds: node.meta.children.map(child => child.id),
      meta,
    }
  }

  openNode(node: ExpandableNode) {
    if (!(node.meta.children && node.meta.children.length)) {
      // can't open node without children
      return;
    }
    // turn node into a container
    const containerNode: ClusterNode = this.turnNodeToContainer(node);
    let newNodes = this.mapState$.value.nodes.filter(n => n.id !== node.id);
    const newClusters: ClusterNode[] = [ ...this.mapState$.value.clusters, containerNode ];

    // add child nodes
    const children: TypedNode[] = node.meta.children
    newNodes = [ ...newNodes, ...children ];

    // create edges that would point to child nodes
    const newEdges = this.getExpandedEdges(node);

    // update the graph
    const newMapState: MapSchema = {
      ...this.mapState$.value,
      nodes: newNodes,
      links: newEdges,
      clusters: newClusters,
    }

    this.mapState$.next(newMapState);
    this.mapUpdate$.next(true);
  }

  private getExpandedEdges(node: Node) {
    return this.mapState$.value.links
      .map(link => {
        if (link.source === node.id || link.target === node.id) {
          return this.turnLinkToPointAtChildOf(link, node.id);
        }
        return link;
      });
  }

  private turnLinkToPointAtChildOf(link: ExpandableEdge, node_id: string): Edge {
    if (link.source === node_id) {
      if (!link.data.child_source_id) { throw new Error('Tried to expand a node with no matching child source spesified'); }
      return { ...link, source: link.data.child_source_id, data: {} }
    }
    if (link.target === node_id) {
      if (!link.data.child_target_id) { throw new Error('Tried to expand a node with no matching child target spesified'); }
      return { ...link, source: link.data.child_target_id, data: {} }
    }
    throw new Error(`Given a link to re-point with a node that is not part of it. (node id: ${node_id}, link id: ${link.id})`);
  }

  getMap(): Observable<MapSchema> {
    return this.mapState$.asObservable();
  }

  getMapUpdate(): Subject<MapSchema> {
    return this.mapUpdate$;
  }
}
