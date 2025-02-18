import { ViewportScroller } from "@angular/common";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

@Injectable()
export abstract class FormBaseComponent {
    public formChanged: boolean = false;
    public formGroup: FormGroup;
    private valueChangesSubscription: Subscription;

    constructor(protected viewportScroller: ViewportScroller, formGroup: FormGroup) {
        if (viewportScroller) {
            viewportScroller.setOffset([100, 100]);
        }
        this.formGroup = formGroup;
        this.valueChangesSubscription = new Subscription();
    }

    onFormValueChange() {        
        const initialValue = this.formGroup.value;
        this.valueChangesSubscription = this.formGroup.valueChanges.subscribe(value => {
            this.formChanged = Object.keys(initialValue).some(key => {
                if (key == 'phone' || key == 'fax' || key == 'mobile') {
                    let value = this.formGroup.value[key]?.e164Number;
                    return value != initialValue[key];
                }
                else {
                    return this.formGroup.value[key] != initialValue[key];
                }

            });
        });
    }

    ngOnDestroy() {
        this.valueChangesSubscription.unsubscribe();
    }
}