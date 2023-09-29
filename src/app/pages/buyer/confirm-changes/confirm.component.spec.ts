import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { BuyerConfirmChangesComponent } from './confirm.component';

describe('BuyerConfirmChangesComponent', () => {
  let component: BuyerConfirmChangesComponent;
  let fixture: ComponentFixture<BuyerConfirmChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [BuyerConfirmChangesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }), // Mock the ActivatedRoute params
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerConfirmChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize org and org$ variables', () => {
    expect(component.org).toBeUndefined();
    expect(component.org$).toBeInstanceOf(Observable);
  });

  it('should call the organisationService.getById method with the correct ID', () => {
    const mockOrganisationService = TestBed.inject(OrganisationService);
    const mockOrg = { ciiOrganisationId: 1 };

    jest.spyOn(mockOrganisationService, 'getById').mockReturnValue(of(mockOrg));

    expect(mockOrganisationService.getById).toHaveBeenCalledWith('1');
    expect(component.org).toEqual(mockOrg);
  });

  it('should navigate to the success page when onSubmitClick is called', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');

    component.onSubmitClick();

    expect(routerSpy).toHaveBeenCalledWith('buyer/success');
  });

  it('should navigate to the search page when onCancelClick is called', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');

    component.onSubmitClick();

    expect(routerSpy).toHaveBeenCalledWith('buyer/search');
  });

  it('should navigate to the confirm page with the correct ID when onBackClick is called', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');

    component.org = { ciiOrganisationId: 1 };

    component.onBackClick();

    expect(routerSpy).toHaveBeenCalledWith('buyer/confirm/1');
  });
});
