import { Checkbox, FormField, Validation } from './../../models/form-fields.model';
import { CustomValidators } from './../../validators/custom.validators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from './../../services/api-service.service';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit, OnDestroy {
  formSettings!: any;
  formFields!: any[];
  formValues!: any;

  form!: FormGroup;

  private checkboxChangeSub$!: Subscription;

  constructor(
    private readonly api: ApiService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      repeaters: this.fb.array([])
    });
  }

  async ngOnInit(): Promise<any> {
    this.formSettings = await this.api.form.formSettings('test_task.php');

    if(this.formSettings) {
      this.formFields = this.formSettings.fields;
      this.formValues = this.formSettings.value;
      this.formInit(this.formFields);
    }
  }

  ngOnDestroy(): void {
    this.checkboxChangeSub$.unsubscribe();
  }

  public formInit(fields: FormField[]) {
    fields.forEach((field: FormField) => {
      if(field.type === "text") {
        this.form.addControl(field.slug, this.fb.control(this.formValues[field.slug] || "", this.getValidator(field.validation)));
      }

      if(field.type === "checkbox") {
        this.form.addControl(field.slug, this.fb.array([], this.getValidator(field.validation, field.type)));

        let checkboxArray = this.form.get(field.slug) as FormArray;

        this.checkboxChangeSub$ = checkboxArray.valueChanges.subscribe(c => {
          checkboxArray.setValue(checkboxArray.value.map((value: any, i: number) => value ? i+1 : null), { emitEvent: false })
        })

        field.configuration.list.forEach((checkbox: Checkbox) => {
          const c = new FormControl(this.formValues[field.slug].find((x: number) => x === checkbox.id));
          checkboxArray.push(c) 
        });
      }
    });
  }

  getValidator(validation: Validation[] | [], fieldType?: string) {
    let isRequired = validation[0]?.type === 'required';

    if(fieldType === 'checkbox') {
      return isRequired ? CustomValidators.multipleCheckboxRequireOne : null;
    }
    return isRequired ? Validators.required : null;
  }

  refForm(formName: string) {
    return this.form.get(formName) as FormArray;                            
  }

  removeRepeatForm(i: number) {
    let repeaters = this.form.controls['repeaters'] as FormArray;
    repeaters.removeAt(i);
  }

  setRepeatForm(nestedFields: FormField[]) {
    let repeaters = this.form.controls['repeaters'] as FormArray;

    if(nestedFields.length === repeaters.length) return;

    let repeatForm: FormGroup = this.fb.group({});

    nestedFields.forEach(field => {
      if(field.type === "text") {
        repeatForm.addControl(field.slug, this.fb.control(this.formValues['repeater'][repeaters.length][field.slug] || "", this.getValidator(field.validation)));
      }

      if(field.type === "checkbox") {
          repeatForm.addControl(`repeat-${field.slug}${repeaters.length+1}`, this.fb.array([], this.getValidator(field.validation, field.type)));

          let checkboxArray = repeatForm.get(`repeat-${field.slug}${repeaters.length+1}`) as FormArray;

          this.checkboxChangeSub$ = checkboxArray.valueChanges.subscribe(c => {
            checkboxArray.setValue(checkboxArray.value.map((value: any, i: number) => value ? i+1 : null), { emitEvent: false })
          })

          field.configuration.list.forEach((checkbox: Checkbox) => {
            const c = new FormControl(this.formValues['repeater'][repeaters.length][field.slug].find((x: number) => x === checkbox.id));
            checkboxArray.push(c) 
          });
      }
    });

    repeaters.insert(repeaters.length, repeatForm);
  }

  send() {
    console.log('form values', this.form.value);
  }
}
