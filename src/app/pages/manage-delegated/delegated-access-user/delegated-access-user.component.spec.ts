import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelegatedAccessUserComponent } from './delegated-access-user.component';

describe('DelegatedAccessUserComponent', () => {
  let component: DelegatedAccessUserComponent;
  let fixture: ComponentFixture<DelegatedAccessUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [DelegatedAccessUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedAccessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the form with correct elements', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.govuk-heading-xl').textContent).toContain(
      'My Form'
    );
    expect(compiled.querySelector('.govuk-label').textContent).toContain(
      'Name'
    );
    expect(compiled.querySelector('.govuk-input').getAttribute('type')).toBe(
      'text'
    );
    expect(compiled.querySelector('.govuk-button').textContent).toContain(
      'Submit'
    );
  });

  it('should update the name value on input change', () => {
    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('.govuk-input');
    input.value = 'John Doe';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.formGroup.value.name).toBe('John Doe');
  });

  it('should call the onSubmit method when the form is submitted', () => {
    spyOn(component, 'onSubmit');
    const compiled = fixture.nativeElement;
    const form = compiled.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
