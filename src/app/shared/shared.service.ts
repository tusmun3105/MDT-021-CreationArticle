import { Injectable } from '@angular/core';
import { IMIRequest, IMIResponse, IUserContext, MIRecord } from '@infor-up/m3-odin';
import { MIService, UserService } from '@infor-up/m3-odin-angular';

@Injectable({
   providedIn: 'root'
})
export class SharedService {
   userContext = {} as IUserContext;

   constructor(private miService: MIService, private userService: UserService,
   ) { }

   async getUserContext(): Promise<any> {
      try {
         // Wrap the observable in a promise
         this.userContext = await new Promise((resolve, reject) => {
            this.userService.getUserContext().subscribe(
               (userContext: IUserContext) => {
                  this.userContext = userContext;
                  console.log("userContext", userContext)
                  resolve(userContext);
               },
               (errorContext: IUserContext) => {
                  reject(errorContext);
               }
            );
         });
         return this.userContext;

      } catch (error) {
         console.error('Error:', error);
         return []; // or handle error as needed
      }
   }
   async call_MMS005_LstWarehouses(): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('CONO', this.userContext?.CONO?.trim());

         const request: IMIRequest = {
            program: 'MMS005MI',
            transaction: 'LstWarehouses',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['WHLO, WHNM', 'FACI']
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [];
         }
      } catch (error) {
         console.error("Error:", error);
         return [];
      }
   }
   async call_MMS005_GetWarehouse(whlo: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('WHLO', whlo?.trim());

         const request: IMIRequest = {
            program: 'MMS005MI',
            transaction: 'GetWarehouse',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['WHLO']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS200_GetItem(itno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('ITNO', itno?.trim());

         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'Get',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS200_GetItmFac(faci: string, itno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('FACI', faci?.trim());
         inputRecord.setString('ITNO', itno?.trim());

         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'GetItmFac',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['ORCO', 'CSNO', 'ACRF']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS200_GetItmWhsBasic(whlo: string, itno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('WHLO', whlo?.trim());
         inputRecord.setString('ITNO', itno?.trim());

         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'GetItmWhsBasic',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_PDS001_Select(qery: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', qery);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [];
         }
      } catch (error) {
         console.error("Error:", error);
         return [];
      }
   }
   async call_CUSEXT_GetFieldValue(file: string, itno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('FILE', file?.trim());
         inputRecord.setString('PK01', itno?.trim());

         const request: IMIRequest = {
            program: 'CUSEXTMI',
            transaction: 'GetFieldValue',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['N096', 'N196']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_CRS025_LstItemGroup() {
      try {
         const inputRecord = new MIRecord();

         const request: IMIRequest = {
            program: 'CRS025MI',
            transaction: 'LstItemGroup',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['ITGR', 'TX15', 'TX40']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_EXPORT_LstItemDiscountGroup() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CTSTKY, CTTX15, CTTX40 from CSYTAB where CTCONO = ${this.userContext.currentCompany} and CTSTCO = DIGI`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [CTSTKY, CTTX15, CTTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     DIGI: CTSTKY || '',
                     TX15: CTTX15 || '',
                     TX40: CTTX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_EXPORT_LstItemMatiereCFI3() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CTSTKY, CTTX15, CTTX40 from CSYTAB where CTCONO = ${this.userContext.currentCompany} and CTSTCO = CFI3`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [CTSTKY, CTTX15, CTTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     CFI3: CTSTKY || '',
                     TX15: CTTX15 || '',
                     TX40: CTTX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_EXPORT_LstPurchaseGroup() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CTSTKY, CTTX15, CTTX40 from CSYTAB where CTCONO = ${this.userContext.currentCompany} and CTSTCO = PRGP`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [CTSTKY, CTTX15, CTTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     PRGP: CTSTKY || '',
                     TX15: CTTX15 || '',
                     TX40: CTTX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CRS128_LstByNumber() {
      try {
         const inputRecord = new MIRecord();

         const request: IMIRequest = {
            program: 'CRS128MI',
            transaction: 'LstByNumber',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['CSNO', 'TX15', 'TX40']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CRS045_LstCountry() {
      try {
         const inputRecord = new MIRecord();

         const request: IMIRequest = {
            program: 'CRS045MI',
            transaction: 'LstCountry',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['CSCD', 'TX15', 'TX40']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CRS040_LstItemTypes() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CTSTKY, CTTX15, CTTX40 from CSYTAB where CTCONO = ${this.userContext.currentCompany} and CTSTCO = ITTY`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [CTSTKY, CTTX15, CTTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     ITTY: CTSTKY || '',
                     TX15: CTTX15 || '',
                     TX40: CTTX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CRS335_LstCtrlObj() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CTSTKY, CTTX15, CTTX40 from CSYTAB where CTCONO = ${this.userContext.currentCompany} and CTSTCO = ACRF`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [CTSTKY, CTTX15, CTTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     ACRF: CTSTKY || '',
                     TX15: CTTX15 || '',
                     TX40: CTTX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CRS030_LstVAT() {
      try {
         const inputRecord = new MIRecord();

         const request: IMIRequest = {
            program: 'CRS030MI',
            transaction: 'LstVat',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['VTCD', 'TX15', 'TX40']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS200_CpyItmBasic(input: any): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         // Required fields
         inputRecord.setString("CITN", input.refItem?.trim() || "");
         inputRecord.setString("ITNO", input.newItem?.trim() || "");
         // Optional fields
         inputRecord.setString("STAT", input.stat || "");
         inputRecord.setString("ITDS", input.itds || "");
         inputRecord.setString("FUDS", input.fuds || "");
         inputRecord.setString("RESP", input.resp || "");
         inputRecord.setString("DCCD", input.dccd || "");
         inputRecord.setString("UNMS", input.unms || "");
         inputRecord.setString("ITTY", input.itty || "");
         inputRecord.setString("CHCD", input.chcd || "");
         inputRecord.setString("STCD", input.stcd || "");
         inputRecord.setString("GRWE", input.grwe || "");
         inputRecord.setString("WAPC", input.wapc || "");
         inputRecord.setString("CFI3", input.cfi3 || "");
         inputRecord.setString("TXID", input.txid || "");
         inputRecord.setString("DTID", input.dtid || "");
         inputRecord.setString("PRGP", input.prgp || "");
         inputRecord.setString("ACRF", input.acrf || "");
         inputRecord.setString("SALE", input.sale || "");
         inputRecord.setString("ATMO", input.atmo || "");
         inputRecord.setString("ATMN", input.atmn || "");
         inputRecord.setString("DIGI", input.digi || "");
         inputRecord.setString("ITGR", input.itgr || "");
         inputRecord.setString("NEWE", input.newe || "");
         inputRecord.setString("TPCD", input.tpcd || "");
         inputRecord.setString("PPUN", input.ppun || "");
         inputRecord.setString("HIE1", input.hie1 || "");
         inputRecord.setString("HIE2", input.hie2 || "");
         inputRecord.setString("HIE3", input.hie3 || "");
         inputRecord.setString("ALUC", input.aluc || "");
         inputRecord.setString("TPLI", input.tpli || "");
         inputRecord.setString("STUN", input.stun || "");
         inputRecord.setString("SPUN", input.spun || "");
         inputRecord.setString("ALUN", input.alun || "");
         inputRecord.setString("VTCP", input.vtcp || "");
         inputRecord.setString("VTCS", input.vtcs || "");
         inputRecord.setString("CHID", input.chid || "");
         inputRecord.setString("CPUN", input.cpun || "");
         inputRecord.setString("DELPIC", input.delpic || "");
         inputRecord.setString("DELGAM", input.delgam || "");
         inputRecord.setString("DELCHEF", input.delchef || "");
         inputRecord.setString("INDI", input.indi || "");
         inputRecord.setString("BACD", input.bacd || "");

         const request: IMIRequest = {
            program: "MMS200MI",
            transaction: "CpyItmBasic",
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: [],
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_MMS200_CpyItmFac(
      input: any
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('FACI', input.cpyfaci?.trim() || '');
         inputRecord.setString('ITNO', input.newItem?.trim() || '');
         inputRecord.setString('CFAC', input.cpyfaci?.trim() || '');
         inputRecord.setString('CITN', input.refItem?.trim() || '');
         inputRecord.setString('ORCO', input.orco?.trim() || '');
         inputRecord.setString('ACRF', input.acrf?.trim() || '');
         inputRecord.setString('CSNO', input.csno?.trim() || '');



         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'CpyItmFac',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS200_UpdItmPrice(
      itno: string, digi: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('ITNO', itno?.trim());
         inputRecord.setString('DIGI', digi?.trim() || '');

         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'UpdItmPrice',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CUSEXT_AddFieldValue(
      file, itno: string, delpic: string, delgam: string, delchef: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('FILE', file?.trim());
         inputRecord.setString('PK01', itno?.trim());
         inputRecord.setString('N096', delpic?.trim() || '');
         inputRecord.setString('N196', delgam?.trim() || '');
         inputRecord.setString('N296', delchef?.trim() || '');

         const request: IMIRequest = {
            program: 'CUSEXTMI',
            transaction: 'AddFieldValue',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CUSEXT_ChgieldValue(
      file, itno: string, delpic: string, delgam: string, delchef: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('FILE', file?.trim());
         inputRecord.setString('PK01', itno?.trim());
         inputRecord.setString('N096', delpic?.trim() || '');
         inputRecord.setString('N196', delgam?.trim() || '');
         inputRecord.setString('N296', delchef?.trim() || '');

         const request: IMIRequest = {
            program: 'CUSEXTMI',
            transaction: 'ChgFieldValue',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS030_Add(
      itno: string, lncd: string, itds: string, fuds: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('ITNO', itno?.trim() || '');
         inputRecord.setString('LNCD', lncd?.trim() || '');
         inputRecord.setString('ITDS', itds?.trim() || '');
         inputRecord.setString('FUDS', fuds?.trim() || '');

         const request: IMIRequest = {
            program: 'MMS030MI',
            transaction: 'Add',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS025_AddAlias(
      alwt: string, itno: string, popn: string, alwq: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('ALWT', alwt?.trim() || '');
         inputRecord.setString('ITNO', itno?.trim() || '');
         inputRecord.setString('POPN', popn?.trim() || '');
         inputRecord.setString('ALWQ', alwq?.trim() || '');

         const request: IMIRequest = {
            program: 'MMS025MI',
            transaction: 'AddAlias',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS025_LstAlias(
      itno: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('ITNO', itno?.trim() || '');

         const request: IMIRequest = {
            program: 'MMS025MI',
            transaction: 'LstAlias',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : response.items;
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CRS230_LstDocID() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `DODOID, DODODE from MPDDOC where DOCONO = ${this.userContext.currentCompany}`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [DODOID, DODODE] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     DWNO: DODOID || '',
                     TX15: DODODE || '',
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_ENS010_LstEcoOrg() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `ECECRG, ECTX15, ECTX40 from CECORG where ECCONO = ${this.userContext.currentCompany}`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [ECECRG, ECTX15, ECTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     ECRG: ECECRG || '',
                     TX15: ECTX15 || '',
                     TX40: ECTX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_ENS015_LstEcoContri() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CEECOC, CETX15, CETX40 from CECOCC where CECONO = ${this.userContext.currentCompany}`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [CEECOC, CETX15, CETX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     ECOP: CEECOC || '',
                     TX15: CETX15 || '',
                     TX40: CETX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MNS150_LstResp() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `JUUSID, JUTX40 from CMNUSR where JUUSTA = 20`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [JSUSID, JUTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     USID: JSUSID || '',
                     TX15: JUTX40 || '',
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS043__LstDistributionGroupTech() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CTSTKY, CTTX15, CTTX40 from CSYTAB where CTCONO = ${this.userContext.currentCompany} and CTSTCO = GRTS`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [CTSTKY, CTTX15, CTTX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     GRTS: CTSTKY || '',
                     TX15: CTTX15 || '',
                     TX40: CTTX40 || ''
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_CRS620_LstSuppliers() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `IDSUNO, IDSUNM from CIDMAS where IDCONO = ${this.userContext.currentCompany} and IDSTAT = 20`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [IDSUNO, IDSUNM] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     SUNO: IDSUNO || '',
                     TX15: IDSUNM || '',
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_PDS010_LstWorkCenters(faci: string) {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `PPPLGR, PPPLNM from MPDWCT where PPCONO = ${this.userContext.currentCompany} and PPFACI = ${faci?.trim()}`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [PPPLGR, PPPLNM] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     WCLN: PPPLGR || '',
                     TX15: PPPLNM || '',
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }
   async call_MMS010_LstEmplacement(whlo: string) {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `MSWHSL, MSSLDS from MITPCE where MSCONO = ${this.userContext.currentCompany} and MSWHLO = ${whlo?.trim()}`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']

         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items.map(item => {
                  const [MSWHSL, MSSLDS] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     WHSL: MSWHSL || '',
                     TX15: MSSLDS || '',
                  };
               });
               ;
            } else {
               return response.items;
            }
         } else {
            return [{ error: true, errorMessage: response.errorMessage }];
         }
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_CRS040_GetTPCDFromITTY(itty: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `TYTPCD from MITTTY where TYCONO = ${this.userContext.currentCompany} and TYITTY = ${itty}`);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [];
         }
      } catch (error) {
         console.error("Error:", error);
         return [];
      }
   }

   async call_MMS025_CheckIfExistEA13(qery: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', qery);

         const request: IMIRequest = {
            program: 'EXPORTMI',
            transaction: 'Select',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['REPL']
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            if (response.items.length > 0) {
               const items = response.items;
               return items;
            } else {
               return response.items;
            }
         } else {
            return [];
         }
      } catch (error) {
         console.error("Error:", error);
         return [];
      }
   }
   displayErrorMessage(title: string, message: string) {
      $('body').message({
         title: '<span>' + title + '</span>',
         status: 'error',
         message: message,
         buttons: [{
            text: 'OK',
            click: function () {
               $(this).data('modal').close();
            },
            isDefault: true
         }]
      }).off('beforeopen').on('beforeopen', function () {
      }).off('beforeclose').on('beforeclose', function () {
      });
   }
   displaySuccessMessage(title: string, message: string) {
      $('body').message({
         title: '<span>' + title + '</span>',
         status: 'success',
         message: message,
         buttons: [{
            text: 'OK',
            click: function () {
               $(this).data('modal').close();
            },
            isDefault: true
         }]
      }).off('beforeopen').on('beforeopen', function () {
      }).off('beforeclose').on('beforeclose', function () {
      });
   }
   displayToast(title: string, msg: string) {
      $('body').toast({
         title: title,
         message: msg,
         attributes: {
            name: 'id', value: function (args) {
               return 'toast-id-' + args.toastIndex;
            }
         }
      });
   }
}
