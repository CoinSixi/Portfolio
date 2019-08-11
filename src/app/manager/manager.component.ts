import { Component, OnInit } from '@angular/core';
import { AnavigationComponent} from '../anavigation/anavigation.component';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
