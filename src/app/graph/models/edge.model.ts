import { Edge } from "@swimlane/ngx-graph";

export interface ExpandableEdge extends Edge {
	data?: { child_source_id?: string, child_target_id?: string }
}