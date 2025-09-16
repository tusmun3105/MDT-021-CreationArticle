import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LanguageService } from '../shared/language.service';
import { SharedService } from '../shared/shared.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
   selector: 'app-selection-reference',
   templateUrl: './selection-reference.component.html',
   styleUrls: ['./selection-reference.component.css']
})
export class SelectionReferenceComponent implements OnInit {
   constructor(public lang: LanguageService, private shared: SharedService, private elRef: ElementRef, private renderer: Renderer2, private router: Router) {
   }

   async ngOnInit(): Promise<void> {
      //Panel Navigation
      console.log("window.location.href", window.location.href)
      this.handlePanelNavigation(window.location.href);
   }

   async handlePanelNavigation(url: string) {
      // console.log("url", url);
      // const val = this.urlCheck(url);
      // console.log("val", val);
      // const itno = "30004539ZZ";//val?.ITNO?.trim() || '';
      // const whlo = "202";//val?.WHLO?.trim() || '';
      // let panel = "MMA002BC"; //val?.PANEL?.trim() || '';
      // const faci = "200";//val?.FACI?.trim() || '';
      // const respITNO = await this.shared.call_MMS200_GetItem(itno);


      console.log("url", url);
      const val = this.urlCheck(url);
      console.log("val", val);
      const itno = val?.ITNO?.trim() || '';
      const whlo = val?.WHLO?.trim() || '';
      let panel = val?.PANEL?.trim() || '';
      const faci = val?.FACI?.trim() || '';
      const respITNO = await this.shared.call_MMS200_GetItem(itno);


      if (respITNO.length === 0 || respITNO[0].error) return;

      const stcd = respITNO[0]?.STCD;

      if (panel === 'MMA001BC') {
         if (stcd === '1') {
            this.shared.displayErrorMessage(`${this.lang.get('CORRECT_PANEL')['WARNING']}`, `${this.lang.get('CORRECT_PANEL')['MMS002']}`);
            return;
         }

         if (stcd === '0') {
            const respKIT_FG = await this.shared.call_PDS001_Select(
               `PHPRNO, PHSTRT from MPDHED where PHPRNO = ${itno} and PHSTRT = KIT`
            );

            if (respKIT_FG.length > 0) {
               this.shared.displayErrorMessage(`${this.lang.get('CORRECT_PANEL')['WARNING']}`, `${this.lang.get('CORRECT_PANEL')['MMS003']}`);
               return;
            }

            const title = this.lang.get('panelFGTitle');
            this.router.navigate(['/component-KIT_FG'], {
               state: { WHLO: '', FACI: faci, ITNOREF: itno, Title: title }
            });
            return;
         }
      }

      if (panel === 'MMA002BC') {
         if (stcd === '0') {
            const respKIT_FG = await this.shared.call_PDS001_Select(
               `PHPRNO, PHSTRT from MPDHED where PHPRNO = ${itno} and PHSTRT = KIT`
            );

            if (respKIT_FG.length > 0) {
               this.shared.displayErrorMessage(`${this.lang.get('CORRECT_PANEL')['WARNING']}`, `${this.lang.get('CORRECT_PANEL')['MMS003']}`);
               return;
            } else {
               const title = this.lang.get('panelFGTitle');
               this.router.navigate(['/component-KIT_FG'], {
                  state: { WHLO: '', FACI: faci, ITNOREF: itno, Title: title }
               });
               return;
            }
         }

         if (stcd === '1') {
            const respGetItemWarehouse = await this.shared.call_MMS200_GetItmWhsBasic(whlo, itno);
            if (respGetItemWarehouse.length === 0 || respGetItemWarehouse[0].error) return;

            const puit = respGetItemWarehouse[0]?.PUIT;
            const oplc = respGetItemWarehouse[0]?.OPLC;
            const plcd = respGetItemWarehouse[0]?.PLCD;

            const route =
               puit === '1' ? '/component-OF'
                  : puit === '2' ? '/component-OF'
                     : puit === '3' ? '/component-OF'
                        : null;

            if (route) {
               this.router.navigate([route], {
                  state: { WHLO: whlo, FACI: faci, ITNOREF: itno, Title: "title", PUIT: puit, OPLC: oplc, PLCD: plcd }
               });
            }
         }
      }

      if (panel === 'MMA003BC') {
         if (stcd === '1') {
            this.shared.displayErrorMessage(`${this.lang.get('CORRECT_PANEL')['WARNING']}`, `${this.lang.get('CORRECT_PANEL')['MMS002']}`);
            return;
         } else if (stcd === '0') {
            const respKIT_FG = await this.shared.call_PDS001_Select(
               `PHPRNO, PHSTRT from MPDHED where PHPRNO = ${itno} and PHSTRT = KIT`
            );

            if (respKIT_FG.length > 0) {
               const title = this.lang.get('panelKITTitle');
               this.router.navigate(['/component-KIT_FG'], {
                  state: { WHLO: '', FACI: faci, ITNOREF: itno, Title: title }
               });
               return;
            } else {
               this.shared.displayErrorMessage(`${this.lang.get('CORRECT_PANEL')['WARNING']}`, `${this.lang.get('CORRECT_PANEL')['MMS001']}`);
               return;
            }

         }
      }
   }

   urlCheck(url: string) {
      // Get the query part
      let queryPart = url.split('?').slice(1).join('?'); // in case multiple ?

      // Replace %3F with & before decoding
      queryPart = queryPart.replace(/%3F/gi, '&');
      queryPart = decodeURIComponent(queryPart);

      const params = {};

      // Split by & and extract key=value
      queryPart.split('&').forEach(pair => {
         const [key, value] = pair.split('=');
         if (key && value !== undefined) {
            params[key] = value;
         }
      });

      const panel = params["PANEL"] || null;
      const sortOrder = params["SORTORDER"] || null;

      if (panel === "MMA001BC") {
         return {
            WHLO: null,
            FACI: null,
            ITNO: params["ITNO"] || null,
            PANEL: panel
         };
      }

      if (panel === "MMA002BC") {
         if (sortOrder === "1") {
            return {
               WHLO: params["WHLO"] || null,
               FACI: null,
               ITNO: params["ITNO"] || null,
               PANEL: panel
            };
         }
         if (sortOrder === "2") {
            return {
               WHLO: params["WHLO1"] || null,
               FACI: null,
               ITNO: params["ITNO1"] || null,
               PANEL: panel
            };
         }
      }

      if (panel === "MMA003BC") {
         if (sortOrder === "1") {
            return {
               WHLO: null,
               FACI: params["FACI"] || null,
               ITNO: params["ITNO"] || null,
               PANEL: panel
            };
         }
         if (sortOrder === "2") {
            return {
               WHLO: null,
               FACI: params["FACI1"] || null,
               ITNO: params["ITNO1"] || null,
               PANEL: panel
            };
         }
      }

      return {
         WHLO: params["WHLO"] || null,
         FACI: params["FACI"] || null,
         ITNO: params["ITNO"] || null,
         PANEL: panel
      };
   }



}
