import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../services/api-service.service';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  formSettings!: any[];
  constructor(private readonly api: ApiService) {

  }

  async ngOnInit(): Promise<any> {
    this.formSettings = await this.api.form.formSettings('test_task.php');
    console.log('this.formSettings: ', this.formSettings);
  }
}


