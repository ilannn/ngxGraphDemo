import { Edge } from "@swimlane/ngx-graph";

export interface ExpandableEdge extends Edge {
	data?: {
		childSourceId?: string,
		childTargetId?: string,
		parentSourceId?: string,
		parentTargetId?: string,
	}
}