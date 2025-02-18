import { ViewportScroller } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { getSideNavVisible } from 'src/app/store/ui.selectors';
import { UIState } from 'src/app/store/ui.states';
import { BaseComponent } from './base.component';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let uiStore: Store<UIState>;
  let viewportScroller: ViewportScroller;
  let scrollHelper: ScrollHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [ViewportScroller, ScrollHelper],
    });

    uiStore = TestBed.inject(Store);
    viewportScroller = TestBed.inject(ViewportScroller);
    scrollHelper = TestBed.inject(ScrollHelper);

    component = new BaseComponent(uiStore, viewportScroller, scrollHelper);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sideNavVisible$ to the value from the store', () => {
    const mockStoreValue = true;
    spyOn(uiStore, 'pipe').and.returnValue(of(mockStoreValue));

    component = new BaseComponent(uiStore, viewportScroller, scrollHelper);

    component.sideNavVisible$.subscribe((visible: boolean) => {
      expect(visible).toBe(mockStoreValue);
    });
  });

  it('should set the offset of viewportScroller', () => {
    spyOn(viewportScroller, 'setOffset');

    component = new BaseComponent(uiStore, viewportScroller, scrollHelper);

    expect(viewportScroller.setOffset).toHaveBeenCalledWith([100, 100]);
  });
});
