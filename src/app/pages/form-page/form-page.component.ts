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

  private subscr$!: Subscription;

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
      console.log('this.formFields: ', this.formFields);
      this.formValues = this.formSettings.value;
      console.log('this.formValues: ', this.formValues);

      this.formInit(this.formFields);
    }
  }

  ngOnDestroy(): void {
    this.subscr$.unsubscribe();
  }

  public formInit(fields: any[]) {


    console.log('this.form: ', this.form);

    fields.forEach(field => {
      let validator = () => field.validation[0]?.type === 'required' ? Validators.required : null;
      console.log('validator: ', validator());

      if(field.type === "text") {
        this.form.addControl(field.slug, this.fb.control(this.formValues[field.slug] || "", validator()));
      }

      if(field.type === "checkbox") {

          this.form.addControl(field.slug, this.fb.array([], validator()));

          let checkboxArray = this.form.get(field.slug) as FormArray;

          this.subscr$ = checkboxArray.valueChanges.subscribe(c => {
            console.log('c: ', c);

          })

          field.configuration.list.forEach((checkbox: any) => {

            const c = new FormControl(this.formValues[field.slug].find((x: number) => x === checkbox.id));

            checkboxArray.push(c) 
          });
      }
    });

  }

  refForm(formName: string) {
    return this.form.get(formName) as FormArray;                            
  }

  setCheckboxValue(formArrName: string, formIndex: number = -1) {
    console.log('formArrName: ', formArrName);
    console.log('formIndex: ', formIndex);


    let currentCheckboxArray = formIndex !== -1 ? (<FormArray>this.form.controls['repeaters']).at(formIndex).get(formArrName) as FormArray : this.form.controls[formArrName] as FormArray;


    currentCheckboxArray.setValue(currentCheckboxArray.value.map((value: any, i: number) => value ? i+1 : false))
    console.log('checkboxArray: ', currentCheckboxArray.value);
  }

  removeRepeatForm(i: number) {
    let repeaters = this.form.controls['repeaters'] as FormArray;
    repeaters.removeAt(i);
  }

  setRepeatForm(nestedFields: any[]) {
    let repeaters = this.form.controls['repeaters'] as FormArray;
    console.log('repeaters-length: ', repeaters.length);

    if(nestedFields.length === repeaters.length) return;

    let repeatForm: FormGroup = this.fb.group({});

    nestedFields.forEach(field => {

      if(field.type === "text") {
        field.validation[0].type === 'required' ? 
          repeatForm.addControl(field.slug, this.fb.control(this.formValues['repeater'][repeaters.length][field.slug] || "", Validators.required)) :
            repeatForm.addControl(field.slug, this.fb.control(this.formValues[field.slug] || ""));
      }


      if(field.type === "checkbox") {
        // let checkboxes: FormArray;

          repeatForm.addControl(`repeat-${field.slug}${repeaters.length+1}`, this.fb.array([]));

          let checkboxArray = repeatForm.get(`repeat-${field.slug}${repeaters.length+1}`) as FormArray;

          console.log('checkboxArray: ', checkboxArray);
          field.configuration.list.forEach((checkbox: any) => {
            console.log('checkbox: ', checkbox);
            const c = new FormControl(this.formValues['repeater'][repeaters.length][field.slug].find((x: number) => x === checkbox.id));
            checkboxArray.push(c) 
          });
      }

    });

    repeaters.insert(repeaters.length, repeatForm);


    console.log('repeaters: ', repeaters);

  }

  save() {
    console.log('form', this.form)
  }
}


