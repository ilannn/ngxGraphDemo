import { ClusterNode, Edge } from "@swimlane/ngx-graph";
import { ExpandableEdge } from "./edge.model";
import { ExpandableNode } from "./node.model";


export interface MapSchema {
	links: ExpandableEdge[];
	nodes: ExpandableNode[];
	clusters: ClusterNode[];
}
