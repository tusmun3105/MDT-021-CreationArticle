// src/app/language.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
   translations: any = {};
   currentLang: string = "";
   constructor(private http: HttpClient, private shared: SharedService) { }

   load(lang: string): Promise<void> {
      this.currentLang = lang;
      return this.http.get<any>('assets/language.json').toPromise().then((data) => {
         this.translations = data[lang] || {};
      });
   }



   get(key: string): any {
      const keys = key.split('.');
      let value = this.translations;

      for (const k of keys) {
         if (value && typeof value === 'object' && k in value) {
            value = value[k];
         } else {
            return key;
         }
      }

      return value;
   }


}
