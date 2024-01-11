import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-support-component',
  templateUrl: './help-support-component.html',
  styleUrls: ['./help-support-component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ]
})
export class HelpAndSupportComponent extends BaseComponent implements OnInit {
  isAuthenticated: boolean = false;
  constructor(protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,
    public authService: AuthService, private router: Router, private dataLayerService: DataLayerService) {
    super(uiStore,viewportScroller,scrollHelper);
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe({
      next: (result) => {this.isAuthenticated = result}
    });
    this.dataLayerService.pushPageViewEvent();
  }

}
