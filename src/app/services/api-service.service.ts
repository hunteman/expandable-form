import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

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
      });
  }
}
