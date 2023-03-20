import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static multipleCheckboxRequireOne(control: AbstractControl): ValidationErrors | null {
      let checkboxesArray = control as FormArray;

      if(checkboxesArray.controls.some(c => c.value)) {
        return null;
      } else {
        return { 'checkboxGroupInvalid': true };
      }
  }

  static validateCheckBox(control: AbstractControl): {[key: string]: any} | null {
    if(! control.value) {
      return { 'checkboxInvalid': true };
    }
    return null;
  }
}