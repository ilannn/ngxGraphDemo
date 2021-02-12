import { Injectable } from '@angular/core';
import { MapSchema } from '../../models/map.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ExpandableNode, NodeType, TypedNode } from '../../models/node.model';
import { ClusterNode, Node, Edge, Graph } from '@swimlane/ngx-graph';
import { ExpandableEdge } from '../../models/edge.model';

@Injectable()
export class GraphService {

  private mapState$: BehaviorSubject<MapSchema>;
  mapUpdate$: Subject<boolean> = new Subject<boolean>();
  mapCenter$: Subject<boolean> = new Subject<boolean>();

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
            childSourceId: 'child1',
            childTargetId: 'childB1',
          }
        }, {
          id: 'b',
          source: 'first',
          target: 'c1',
          label: 'custom label',
          data: {
            childSourceId: 'child1',
          }
        }, {
          id: 'd',
          source: 'first',
          target: 'c2',
          label: 'custom label',
          data: {
            childSourceId: 'child1',
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
          type: NodeType.B,
          meta: {
            children: [
              {
                id: 'childB1',
                label: 'Child-1',
                type: NodeType.C,
              },
            ]
          }
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
          label: 'D',
          // dimension: {
          //   width: 100, height: 100
          // }
        }
      ],
      clusters: [
        {
          id: 'third',
          label: 'Cluster node',
          childNodeIds: ['c1', 'c2'],
          // dimension: {
          //   width: 10, height: 10
          // },
          // position: { x: 10, y: 10 },
          // meta: {
          //   forceDimensions: true
          // }
        }
      ]
    })
  }

  private turnNodeToContainer(node: ExpandableNode): ClusterNode {
    /* Open the given node to a container and return a cluster node */
    const meta = { ...node.meta, children: undefined, open: true, forceDimensions: true };
    return {
      ...node,
      childNodeIds: node.meta.children.map(child => child.id),
      // transform: `translate(${node.position.x},${node.position.y})`,  // has no affect
      // dimension: { height: 60, width: 60 }, // has no affect
      // height: 10, width: 10,  // has no affect
      // x: 600, y: 600,  // has no affect
      // position: { x: 600, y: 600 },  // has no affect
      meta,
    }
  }

  private turnContainerToExpandableNode(container: ClusterNode, graph: Graph): ExpandableNode {
    const children: TypedNode[] = graph.nodes
      .filter(node => container.childNodeIds.indexOf(node.id) !== -1 )
      .map(child => { return { ...child, meta: { ...meta, open: false }}});
    const meta = { ...container.meta, children, open: false, forceDimensions: true };
    
    // cleanup container properties
    const relevantData = { ...container };
    delete relevantData['childNodeIds'];

    return {
      ...relevantData,
      dimension: { height: 40, width: 40 },
      // height: 10, width: 10,  // has no affect
      // x: 600, y: 600,  // has no affect
      // position: { x: 600, y: 600 },  // has no affect
      meta,
    }
  }

  openNode(node: ExpandableNode, graph: Graph, links: ExpandableEdge[]) {
    if (!(node.meta.children && node.meta.children.length)) {
      // can't open node without children
      return;
    }
    // turn node into a container
    const containerNode: ClusterNode = this.turnNodeToContainer(node);
    let newNodes = graph.nodes.filter(n => n.id !== node.id);
    const newClusters: ClusterNode[] = [ ...graph.clusters, containerNode ];

    // add child nodes
    const children: TypedNode[] = node.meta.children
    newNodes = [
      ...newNodes, ...children.map(child => {
        return { ...child, meta: { ...child.meta, open: true }};
      })];

    // create edges that would point to child nodes
    const newEdges = this.getExpandedEdges(node, links, true);

    // update the graph
    const newMapState: MapSchema = {
      ...graph,
      nodes: newNodes,
      links: newEdges,
      clusters: newClusters,
    };

    this.mapState$.next(newMapState);
  }

  closeContainer(container: ClusterNode, graph: Graph, links: ExpandableEdge[]) {
    if (!(container.childNodeIds && container.childNodeIds.length)) {
      // no children - nothing to close
      return;
    }
    // turn cluster into a node
    const node: ExpandableNode = this.turnContainerToExpandableNode(container, graph);
    let newNodes: TypedNode[] = [ ...graph.nodes, node ];
    const newClusters: ClusterNode[] = graph.clusters.filter(c => c.id !== container.id);

    // remove children nodes
    newNodes = newNodes.filter(n => container.childNodeIds.indexOf(n.id) === -1);

    // re-create edges to point at new node
    const newEdges = this.getExpandedEdges(node, links, false);

    // update the graph
    const newMapState: MapSchema = {
      ...graph,
      nodes: newNodes,
      links: newEdges,
      clusters: newClusters,
    };

    this.mapState$.next(newMapState);
  }

  private getExpandedEdges(node: ExpandableNode, links: ExpandableEdge[], expand: boolean) {
    return links
      .map(link => {
        if (expand) {
          // if current link points to the expanded node
          if (link.source === node.id || link.target === node.id) {
            return this.turnLinkToPointAtChild(link, node.id);
          }
        } else { // fold
          // if current link points to one of the node's children
          if (node.meta.children && node.meta.children.find(child => child.id === link.source || child.id === link.target)) {
            return this.turnLinkToPointAtNode(link, node.id);
          }
        }
        return link;
      });
  }

  private turnLinkToPointAtChild(link: ExpandableEdge, nodeId: string): ExpandableEdge {
    if (link.source === nodeId) {
      if (!link.data.childSourceId) { throw new Error('Tried to expand a node with no matching child source spesified'); }
      delete link['childSourceId'];
      return {
        ...link,
        source: link.data.childSourceId,
        data: { ...link.data, parentSourceId: link.source }
      };
    }
    if (link.target === nodeId) {
      if (!link.data.childTargetId) { throw new Error('Tried to expand a node with no matching child target spesified'); }
      delete link['childTargetId'];
      return {
        ...link,
        target: link.data.childTargetId,
        data: { ...link.data, parentTargetId: link.target }
      };
    }
    throw new Error(`Given a link to re-point with a node that is not part of it. (node id: ${nodeId}, link id: ${link.id})`);
  }

  private turnLinkToPointAtNode(link: ExpandableEdge, nodeId: string): ExpandableEdge {
    if (link.data && link.data.parentSourceId === nodeId) {
      delete link.data['parentSourceId'];
      return {
        ...link,
        source: nodeId,
        data: { ...link.data, childSourceId: link.source }
      };
    }
    if (link.data && link.data.parentTargetId === nodeId) {
      delete link.data['parentTargetId'];
      return {
        ...link,
        target: nodeId,
        data: { ...link.data , childTargetId: link.target }
      }
    }
    throw new Error(`Given a link to re-point with a node that is not a parent of it. (node id: ${nodeId}, link id: ${link.id})`);
  }

  getMap(): Observable<MapSchema> {
    return this.mapState$.asObservable();
  }

  getMapUpdate(): Subject<boolean> {
    return this.mapUpdate$;
  }
}
