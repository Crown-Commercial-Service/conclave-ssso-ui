import { TestBed } from '@angular/core/testing';
import { ScrollHelper } from './scroll-helper.services';

describe('ScrollHelper', () => {
  let scrollHelper: ScrollHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    scrollHelper = TestBed.inject(ScrollHelper);
  });

  it('should scroll to the specified element', () => {
    const elementId = 'myElementId';
    const scrollingTargetElement = document.createElement('div');
    scrollingTargetElement.id = elementId;
    spyOn(document, 'getElementById').and.returnValue(scrollingTargetElement);

    scrollHelper.scrollToFirst(elementId);
    scrollHelper.doScroll();

    expect(document.getElementById).toHaveBeenCalledWith(elementId);
    expect(scrollHelper['elementIdToScrollTo']).toBeNull();
  });

  it('should not scroll if the element does not exist', () => {
    const elementId = 'nonExistentElementId';
    spyOn(document, 'getElementById').and.returnValue(null);

    scrollHelper.scrollToFirst(elementId);
    scrollHelper.doScroll();

    expect(document.getElementById).toHaveBeenCalledWith(elementId);
    expect(scrollHelper['elementIdToScrollTo']).toBeNull();
  });
});
