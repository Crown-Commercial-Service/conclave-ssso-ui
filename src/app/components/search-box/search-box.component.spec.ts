import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { SearchBoxComponent } from './search-box.component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBoxComponent],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot({}),
      ],
      providers: [ViewportScroller, ScrollHelper],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchTextChange event on searchText change', () => {
    spyOn(component.searchTextChange, 'emit');
    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'test';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchTextChange.emit).toHaveBeenCalledWith('test');
  });

  it('should emit onSearchClickEvent event on search button click', () => {
    spyOn(component.onSearchClickEvent, 'emit');
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('mousedown', null);
    expect(component.onSearchClickEvent.emit).toHaveBeenCalled();
  });
});
