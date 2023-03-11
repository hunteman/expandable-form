import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  public readonly form = ((api: this) => ({
    formSettings(url: string): Promise<any> { return api.apiCallGet(url) }
  }))(this);

  private async apiCallGet(url: string): Promise<any> {
    return this.http.get(this.apiUrl + url)
      .toPromise()
      .catch((e) => {
        console.error(e);
        return {
          "fields": [
            {
              "slug": "text",
              "title": "Text",
              "placeholder": "text",
              "type": "text",
              "configuration": {
                "minLength": 0,
                "maxLength": 10
              },
              "validation": [
                {
                "type": "required",
                "text": "Field is mandatory"
                }
              ]
            },
            {
              "title": "Checkbox",
              "slug": "checkbox",
              "placeholder": null,
              "type": "checkbox",
              "configuration": {
              "list": [
                {
                  "id": 1,
                  "title": "Option 1"
                },
                {
                  "id": 2,
                  "title": "Option 2"
                },
                {
                  "id": 3,
                  "title": "Option 3"
                }
              ]
            },
            "validation": [
              {
                "type": "required",
                "text": "Field is mandatory"
              }
            ]
            },
          {
            "title": "Repeater",
            "slug": "repeater",
            "placeholder": null,
            "type": "repeater",
            "configuration": {
            "incrementTitle": "",
            "addButtonTitle": "",
            "fields": [
              {
                "slug": "text",
                "title": "Text In Repeater",
                "placeholder": "text",
                "type": "text",
                "configuration": {
                  "minLength": 0,
                  "maxLength": 10
                },
                "validation": [
                  {
                    "type": "required",
                    "text": "Field is mandatory"
                  }
                ]
              },
              {
                "title": "Checkbox in Repeater",
                "slug": "checkbox",
                "placeholder": null,
                "type": "checkbox",
                "configuration": {
                "list": [
                  {
                    "id": 1,
                    "title": "Option Repeater 1"
                  },
                  {
                    "id": 2,
                    "title": "Option Repeater 2"
                  },
                  {
                    "id": 3,
                    "title": "Option Repeater 3"
                  }
                ]
              },
          "validation": []
          }
          ]
          },
          "validation": [
          {
          "type": "required",
          "text": "Поле обязательно к заполнению"
          }
          ]
          }
          ],
          "value": {
            "text": "Text Value",
            "checkbox": [
              1,
              2
            ],
            "repeater": [
              {
                "text": "Text in repeater Value 1",
                "checkbox": [
                  2
                ]
              },
              {
                "text": "Text in repeater Value 2",
                "checkbox": [
                  1,
                  3
                ]
              }
            ]
          }
        }
      });
  }
}
