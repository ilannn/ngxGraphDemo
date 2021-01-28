import { Node, NodeDimension, NodePosition } from "@swimlane/ngx-graph";

export enum NodeType {
	A,
	B,
	C,
}

export class TypedNode implements Node {
	id: string;
	position?: NodePosition;
	dimension?: NodeDimension;
	transform?: string;
	label?: string;
	data?: any;
	meta?: any;
	type?: NodeType;
}