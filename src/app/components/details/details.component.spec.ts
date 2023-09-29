import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonAttributesService } from 'src/app/shared/common-attributes.service';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(() => {
    const commonAttributesServiceStub = () => ({
      DetailsAttributes: () => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DetailsComponent],
      providers: [
        {
          provide: CommonAttributesService,
          useFactory: commonAttributesServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const commonAttributesServiceStub: CommonAttributesService = fixture.debugElement.injector.get(
        CommonAttributesService
      );
      const spy1 = jest.spyOn(commonAttributesServiceStub, 'DetailsAttributes');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
