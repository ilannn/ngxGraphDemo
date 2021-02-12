import { Node, NodeDimension, NodePosition } from "@swimlane/ngx-graph";

export enum NodeType {
	A,
	B,
	C,
}

export interface TypedNode extends Node {
	type?: NodeType;
}


export interface ExpandableNode extends TypedNode {
	meta?: { children: TypedNode[], open?: boolean };
}