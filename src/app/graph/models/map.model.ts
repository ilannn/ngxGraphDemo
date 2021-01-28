import { Edge } from "@swimlane/ngx-graph";
import { TypedNode } from "./node.model";


export interface MapSchema {
	links: Edge[];
	nodes: TypedNode[];
}
