import { Component, Input, OnInit } from '@angular/core';
import { NodeType, TypedNode } from '../models/node.model';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit {
  readonly NodeType = NodeType;

  @Input() node: TypedNode;
  constructor() { }

  ngOnInit() {
  }

  onNodeSelect($event) {
    console.log($event);
  }

  onNodeClick($event) {
    console.log($event);
  }

}
