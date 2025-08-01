import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      declarations: [AccordionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideRouter([]),]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AccordionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the groupShow property when onTopToggle is called', () => {
    component.groupShow = false;
    component.onTopToggle();
    expect(component.groupShow).toBe(true);
    component.onTopToggle();
    expect(component.groupShow).toBe(false);
  });

  it('should toggle the display of the element with the given id when onBottomToggle is called', () => {
    const elementId = 'exampleElementId';
    const groupdata = {
      groupId: 'exampleGroupId',
      groupName: 'exampleGroup'
    }
    const element = document.createElement('div');
    element.id = elementId;
    document.body.appendChild(element);
    const sampleEvent:Event = new Event('click');

    const toggleElement = document.createElement('div');
    toggleElement.id = groupdata.groupId;
    element.append(toggleElement);    

    component.onBottomToggle(sampleEvent, groupdata);
    expect(toggleElement.style.display).toBe('block');
    component.onBottomToggle(sampleEvent, groupdata);
    expect(toggleElement.style.display).toBe('none');

    document.body.removeChild(element);
  });

  it('should emit the checkBoxRemoveRoles event when onCheckBoxClick is called with checkValue as true', () => {
    const data = { id: 1, name: 'Example' };
    spyOn(component.checkBoxRemoveRoles, 'emit');
    component.onCheckBoxClick(data, true);
    expect(component.checkBoxRemoveRoles.emit).toHaveBeenCalledWith(data);
  });

  it('should emit the checkBoxAddRoles event when onCheckBoxClick is called with checkValue as false', () => {
    const data = { id: 1, name: 'Example' };
    spyOn(component.checkBoxAddRoles, 'emit');
    component.onCheckBoxClick(data, false);
    expect(component.checkBoxAddRoles.emit).toHaveBeenCalledWith(data);
  });

  it('should toggle the display of the element with the given id when toggleRoleForUser is called', () => {
    const elementId = 'exampleElementId';
    const element = document.createElement('div');
    element.id = elementId;
    document.body.appendChild(element);

    component.toggleRoleForUser(elementId);
    expect(element.style.display).toBe('block');
    component.toggleRoleForUser(elementId);
    expect(element.style.display).toBe('none');

    document.body.removeChild(element);
  });
});
