import { INJECTOR, Injectable } from '@angular/core';
import { IMIRequest, IMIResponse, IUserContext, MIRecord } from '@infor-up/m3-odin';
import { MIService, UserService } from '@infor-up/m3-odin-angular';

@Injectable({
   providedIn: 'root'
})
export class SharedService {
   userContext = {} as IUserContext;
   warehouseLocationRefModel = "";
   constructor(private miService: MIService, private userService: UserService,
   ) { }

   async getUserContext(): Promise<any> {
      try {
         // Wrap the observable in a promise
         this.userContext = await new Promise((resolve, reject) => {
            this.userService.getUserContext().subscribe(
               (userContext: IUserContext) => {
                  this.userContext = userContext;
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

   async call_MMS005_GetWarehouse(whlo: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('WHLO', whlo?.trim());

         const request: IMIRequest = {
            program: 'MMS005MI',
            transaction: 'GetWarehouse',
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
   async call_PDS001_GetProductStructure(faci: string, prno: string, strt: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('FACI', faci?.trim());
         inputRecord.setString('PRNO', prno?.trim());
         inputRecord.setString('STRT', strt?.trim());

         const request: IMIRequest = {
            program: 'PDS001MI',
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
   async call_MMS200_GetItemWarehouseBal(whlo: string, itno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('WHLO', whlo?.trim());
         inputRecord.setString('ITNO', itno?.trim());

         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'GetItmWhsBal',
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
   async call_MMS200_UpdItmBasic(itno: string, acrf: string, length: string, width: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('ITNO', itno?.trim());
         inputRecord.setString('ACRF', acrf?.trim());
         inputRecord.setString('ILEN', length?.trim());
         inputRecord.setString('IWID', width?.trim());

         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'UpdItmBasic',
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
   async call_MMS200_UpdItmWhsBasicLEA1(whlo: string, itno: string, lea1: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('CONO', this.userContext.currentCompany?.trim());
         inputRecord.setString('WHLO', whlo?.trim());
         inputRecord.setString('ITNO', itno?.trim());
         inputRecord.setString('LEA1', lea1?.trim());

         const request: IMIRequest = {
            program: 'MMS200MI',
            transaction: 'UpdItmWhs',
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
            outputFields: ['ORCO', 'CSNO', 'ACRF', 'VAMT', 'ECCC']

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
            outputFields: ['N096', 'N296']

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
   async call_MMS030_List(itno: string) {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('ITNO', itno);
         const request: IMIRequest = {
            program: 'MMS030MI',
            transaction: 'List',
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
   async call_EXPORT_LstCurrency() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `CTSTKY, CTTX15, CTTX40 from CSYTAB where CTCONO = ${this.userContext.currentCompany} and CTSTCO = CUCD`);

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
                     CUCD: CTSTKY || '',
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
   async call_EXPORT_LEA1(whlo: string, itno: string) {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `MBLEA1 from MITBAL where MBCONO = ${this.userContext.currentCompany} and MBWHLO = ${whlo} and MBITNO = ${itno}`);

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
                     CUCD: CTSTKY || '',
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
   async call_MMS005_LstWarehouses() {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         inputRecord.setString('QERY', `MWWHLO, MWWHNM from MITWHL where MWCONO = ${this.userContext.currentCompany}`);

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
                  const [MWWHLO, MWWHNM] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     SUWH: MWWHLO || '',
                     TX15: MWWHNM || '',
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
            } else {
               return response.items;
            }
         }

         else {
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
               return items
                  .map(item => {
                     const [CTSTKY, CTTX15, CTTX40] = (item.REPL || '').split(';');
                     return {
                        ...item,
                        ACRF: CTSTKY || '',
                        TX15: CTTX15 || '',
                        TX40: CTTX40 || ''
                     };
                  })
                  .filter(mappedItem =>
                     mappedItem.ACRF.startsWith("IT") || mappedItem.ACRF.startsWith("YY")
                  ); // ✅ keep only ACRF starting with "IT" or "YY"
            }
            else {
               return response.items;
            }
         }
         else {
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
   async call_MMS200_CpyItmWhsOF_Supplier(input: any): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString("CONO", this.userContext.currentCompany);
         inputRecord.setString("WHLO", input?.WHLO_SUPP?.trim() || "");
         inputRecord.setString("ITNO", input?.newITNO?.trim() || "");
         inputRecord.setString("CWHL", input?.WHLO_SUPP?.trim() || "");
         inputRecord.setString("CITN", input?.refITNO?.trim() || "");

         const request: IMIRequest = {
            program: "MMS200MI",
            transaction: "CpyItmWhs",
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
   async call_MMS200_CpyItmFacOF_Supplier(input: any): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString("CONO", this.userContext.currentCompany);
         inputRecord.setString("FACI", input?.FACI_SUPP?.trim() || "");
         inputRecord.setString("ITNO", input?.newITNO?.trim() || "");
         inputRecord.setString("CFAC", input?.FACI_SUPP?.trim() || "");
         inputRecord.setString("CITN", input?.refITNO?.trim() || "");

         const request: IMIRequest = {
            program: "MMS200MI",
            transaction: "CpyItmFac",
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
   async call_MMS200_CpyItmWhsOF_Client(inputMitbal: any, inputMitmas: any): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString("CONO", this.userContext.currentCompany);
         inputRecord.setString("WHLO", inputMitbal?.WHLO?.trim() || "");
         inputRecord.setString("ITNO", inputMitbal?.newITNO?.trim() || "");
         inputRecord.setString("CWHL", inputMitbal?.WHLO?.trim() || "");
         inputRecord.setString("CITN", inputMitbal?.refModelArticle?.trim() || "");

         inputRecord.setString("RESP", inputMitbal?.RESP?.trim() || "");
         inputRecord.setString("BUYE", inputMitbal?.BUYE?.trim() || "");
         inputRecord.setString("SUNO", inputMitbal?.SUNO?.trim() || "");
         inputRecord.setString("PLCD", inputMitbal?.PLCD?.trim() || "");
         inputRecord.setString("PUIT", inputMitbal?.PUIT?.trim() || "");
         inputRecord.setString("SUWH", inputMitbal?.SUWH?.trim() || "");
         inputRecord.setString("LEA1", inputMitbal?.LEA1?.trim() || "");
         inputRecord.setString("ORTY", inputMitbal?.ORTY?.trim() || "");
         inputRecord.setString("SATD", inputMitbal?.SATD?.trim() || "");
         inputRecord.setString("STAT", inputMitbal?.STAT?.trim() || "");
         inputRecord.setString("ALMT", inputMitbal?.ALMT?.trim() || "");
         inputRecord.setString("SPMT", inputMitbal?.SPMT?.trim() || "");
         inputRecord.setString("WHSL", inputMitbal?.WHSL?.trim() || "");
         inputRecord.setString("VTCP", "0");
         inputRecord.setString("VTCS", inputMitmas?.VTCS?.trim() || "");


         const request: IMIRequest = {
            program: "MMS200MI",
            transaction: "CpyItmWhs",
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
   async call_MMS200_UpdItmFacOF_Client(inputMitbal: any, inputMitfac: any): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString("CONO", this.userContext.currentCompany);
         inputRecord.setString("FACI", inputMitbal?.FACI?.trim() || "");
         inputRecord.setString("ITNO", inputMitbal?.newITNO?.trim() || "");

         inputRecord.setString("ACRF", inputMitfac?.ACRF?.trim() || "");
         inputRecord.setString("CSNO", inputMitfac?.CSNO?.trim() || "");
         inputRecord.setString("ORCO", inputMitfac?.ORCO?.trim() || "");
         inputRecord.setString("VAMT", inputMitfac?.VAMT?.trim() || "");
         inputRecord.setString("REWH", inputMitfac?.REWH?.trim() || "");
         inputRecord.setString("ECCC", inputMitfac?.ECCC?.trim() || "");
         inputRecord.setString("WCLN", inputMitfac?.WCLN?.trim() || "");

         const request: IMIRequest = {
            program: "MMS200MI",
            transaction: "UpdItmFac",
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

   async call_MMS200_CpyItmBasicOF(input: any): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         // Required fields
         inputRecord.setString("CITN", input.refModelArticle);
         inputRecord.setString("ITNO", input.newITNO);

         // Fields from valueMITMAS()
         inputRecord.setString("STAT", input.STAT);
         inputRecord.setString("ITDS", input.ITDS);
         inputRecord.setString("FUDS", input.FUDS);
         inputRecord.setString("RESP", input.RESP);
         inputRecord.setString("DCCD", input.DCCD);
         inputRecord.setString("UNMS", input.UNMS);
         inputRecord.setString("ITTY", input.ITTY);
         inputRecord.setString("CHCD", input.CHCD);
         inputRecord.setString("STCD", input.STCD);
         inputRecord.setString("GRWE", input.GRWE);
         inputRecord.setString("WAPC", input.WAPC);
         inputRecord.setString("CFI3", input.CFI3);
         inputRecord.setString("PRGP", input.PRGP);
         inputRecord.setString("GRTS", input.GRTS);
         inputRecord.setString("SALE", input.SALE);
         inputRecord.setString("ATMO", input.ATMO);
         inputRecord.setString("ATMN", input.ATMN);
         inputRecord.setString("DIGI", input.DIGI);
         inputRecord.setString("TPCD", input.TPCD);
         inputRecord.setString("NEWE", input.NEWE);
         inputRecord.setString("PPUN", input.PPUN);
         inputRecord.setString("ACRF", input.ACRF);
         inputRecord.setString("PUUN", input.PUUN);
         inputRecord.setString("ALUC", input.ALUC);
         inputRecord.setString("TPLI", input.TPLI);
         inputRecord.setString("STUN", input.STUN);
         inputRecord.setString("SPUN", input.SPUN);
         inputRecord.setString("ALUN", input.ALUN);
         inputRecord.setString("VTCP", input.VTCP);
         inputRecord.setString("VTCS", input.VTCS);
         inputRecord.setString("CPUN", input.CPUN);
         inputRecord.setString("DWNO", input.DWNO);
         inputRecord.setString("ITGR", input.ITGR);
         inputRecord.setString("HIE1", input.HIE1);//
         inputRecord.setString("HIE2", input.HIE2);//
         inputRecord.setString("HIE3", input.HIE3);//
         inputRecord.setString("INDI", input.INDI);//
         inputRecord.setString("BACD", input.BACD);//


         const request: IMIRequest = {
            program: "MMS200MI",
            transaction: "CpyItmBasic",
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: [],
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();

         if (!response.hasError()) {
            return response.items.length > 0 ? response.items : [];
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
      file, itno: string, delpic: string, delgam: string, delchef: string, divi: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('FILE', file?.trim());
         inputRecord.setString('PK01', itno?.trim());
         if (file == "MITMAS") {
            inputRecord.setString('PK01', itno?.trim());
            inputRecord.setString('N096', delpic?.trim() || '');
            inputRecord.setString('N196', delgam?.trim() || '');
            inputRecord.setString('N296', delchef?.trim() || '');
         } else {
            inputRecord.setString('PK01', delpic?.trim());//it is alias type in case of MITPOP
            inputRecord.setString('PK02', delgam?.trim());////it is alias qualifier in case of MITPOP
            inputRecord.setString('PK03', itno?.trim() || '');//it is item number in case of MITPOP
            inputRecord.setString('PK04', delchef?.trim() || '');//it is alias number in case of MITPOP
            inputRecord.setString('A030', divi?.trim() || ''); //it is user divi in case of MITPO
         }


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
      file, itno: string, delpic: string, delgam: string, delchef: string, divi: string
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('FILE', file?.trim());
         if (file == "MITMAS") {
            inputRecord.setString('PK01', itno?.trim());
            inputRecord.setString('N096', delpic?.trim() || '');
            inputRecord.setString('N196', delgam?.trim() || '');
            inputRecord.setString('N296', delchef?.trim() || '');
         } else {
            inputRecord.setString('PK01', delpic?.trim());//it is alias type in case of MITPOP
            inputRecord.setString('PK02', delgam?.trim());////it is alias qualifier in case of MITPOP
            inputRecord.setString('PK03', itno?.trim() || '');//it is item number in case of MITPOP
            inputRecord.setString('PK04', delchef?.trim() || '');//it is alias number in case of MITPOP
            inputRecord.setString('A030', divi?.trim() || ''); //it is user divi in case of MITPO
         }

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


   async call_PDS001_Update(faci: string, prno: string, stat: string, strt: string, resp: string, dwno: string, dcon: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('CONO', this.userContext.currentCompany);
         inputRecord.setString('FACI', faci);
         inputRecord.setString('PRNO', prno);
         inputRecord.setString('STAT', stat);
         inputRecord.setString('STRT', strt);
         inputRecord.setString('RESP', resp);
         inputRecord.setString('DWNO', dwno);
         inputRecord.setString('DCON', dcon);


         const request: IMIRequest = {
            program: 'PDS001MI',
            transaction: 'Update',
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
   async call_PDS002_LstComponent(faci: string, prno: string, strt: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('CONO', this.userContext.currentCompany);
         inputRecord.setString('FACI', faci);
         inputRecord.setString('PRNO', prno);
         inputRecord.setString('STRT', strt);


         const request: IMIRequest = {
            program: 'PDS002MI',
            transaction: 'LstComponent',
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
   async call_PDS002_LstOperation(faci: string, prno: string, strt: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('CONO', this.userContext.currentCompany);
         inputRecord.setString('FACI', faci);
         inputRecord.setString('PRNO', prno);
         inputRecord.setString('STRT', strt);


         const request: IMIRequest = {
            program: 'PDS002MI',
            transaction: 'LstOperation',
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
   async call_PDS002_CreateComponent(input: any, newitno: string, whlo: string, whsl: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('CONO', this.userContext.currentCompany);

         Object.keys(input).forEach(key => {
            const value = input[key];
            if (value !== undefined && value !== null) {
               inputRecord.setString(key, String(value).trim());
            }
         });
         inputRecord.setString('PRNO', newitno);
         inputRecord.setString('WHLO', whlo);
         inputRecord.setString('WHSL', whsl);

         const request: IMIRequest = {
            program: 'PDS002MI',
            transaction: 'AddComponent',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();
         return !response.hasError() ? (response.items.length > 0 ? response.items : []) : [{ error: true, errorMessage: response.errorMessage }];
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_PDS002_DeleteCompoNOperation(input: any, newitno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('CONO', this.userContext.currentCompany);

         Object.keys(input).forEach(key => {
            const value = input[key];
            if (value !== undefined && value !== null) {
               inputRecord.setString(key, String(value).trim());
            }
         });
         inputRecord.setString('PRNO', newitno);

         const request: IMIRequest = {
            program: 'PDS002MI',
            transaction: 'Delete',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();
         return !response.hasError() ? (response.items.length > 0 ? response.items : []) : [{ error: true, errorMessage: response.errorMessage }];
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_PDS002_CreateOperation(input: any, newitno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('CONO', this.userContext.currentCompany);

         Object.keys(input).forEach(key => {
            const value = input[key];
            if (value !== undefined && value !== null) {
               inputRecord.setString(key, String(value).trim());
            }
         });
         inputRecord.setString('PRNO', newitno);
         const request: IMIRequest = {
            program: 'PDS002MI',
            transaction: 'AddOperation',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: []
         };

         const response: IMIResponse = await this.miService.execute(request).toPromise();
         return !response.hasError() ? (response.items.length > 0 ? response.items : []) : [{ error: true, errorMessage: response.errorMessage }];
      } catch (error) {
         console.error("Error:", error);
         return [{ error: true, errorMessage: error }];
      }
   }

   async call_PPS040_AddItemSupplier(itno: string, suno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('CONO', this.userContext.currentCompany);
         inputRecord.setString('ITNO', itno);
         inputRecord.setString('SUNO', suno);
         inputRecord.setString('QUCL', "A");
         inputRecord.setString('LCLV', "4");



         const request: IMIRequest = {
            program: 'PPS040MI',
            transaction: 'AddItemSupplier',
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
   async call_CRS620_GetSupplierCUCD(suno: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('CONO', this.userContext.currentCompany);
         inputRecord.setString('SUNO', suno);



         const request: IMIRequest = {
            program: 'CRS620MI',
            transaction: 'GetBasicData',
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: ['CUCD']
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
   async call_PPS040_UpdItemSupplier(itno: string, suno: string, rtyp: string, isrs: string, orco: string, site: string, sitt: string, pupr: string, pucd: string, uvdt: string): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('ITNO', itno);
         inputRecord.setString('SUNO', suno);
         inputRecord.setString('RTYP', rtyp);
         inputRecord.setString('ISRS', isrs);
         inputRecord.setString('ORCO', orco);
         inputRecord.setString('SITE', site);
         inputRecord.setString('SITT', sitt);
         inputRecord.setString('SITD', sitt);
         inputRecord.setString('PUPR', pupr);
         inputRecord.setString('PUCD', pucd);
         inputRecord.setString('FVDT', new Date().toISOString().slice(0, 10).replace(/-/g, ''));
         inputRecord.setString('UVDT', uvdt);

         const request: IMIRequest = {
            program: 'PPS040MI',
            transaction: 'UpdItemSupplier',
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
   async call_MMS059_List(
      splm: any
   ): Promise<any> {
      try {
         const inputRecord = new MIRecord();

         inputRecord.setString('SPLM', splm?.trim() || '');

         const request: IMIRequest = {
            program: 'MMS059MI',
            transaction: 'List',
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
   async call_MMS059_Add(input: any, item: string, orty: string): Promise<any> {
      try {
         const today = new Date();
         const year = today.getFullYear();
         const month = String(today.getMonth() + 1).padStart(2, "0");
         const day = String(today.getDate()).padStart(2, "0");
         const formattedDate = `${year}${month}${day}`;

         const inputRecord = new MIRecord();

         // copy all fields from input (recordFound)
         Object.keys(input).forEach((key) => {
            if (input[key] !== undefined && input[key] !== null) {
               inputRecord.setString(key, String(input[key])?.trim());
            }
         });

         // overwrite / add FDAT and TDAT
         inputRecord.setString("CONO", this.userContext.currentCompany);
         inputRecord.setString("OBV1", item);
         inputRecord.setString("FDAT", formattedDate);
         inputRecord.setString("ORTY", orty);

         const request: IMIRequest = {
            program: "MMS059MI",
            transaction: "Add",
            record: inputRecord,
            maxReturnedRecords: 0,
            outputFields: [],
         };

         const response: IMIResponse = await this.miService
            .execute(request)
            .toPromise();

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
   async call_LstOrderType(cono: string, puit: string) {
      try {
         const inputRecord = new MIRecord();
         inputRecord.setString('SEPC', ";");
         inputRecord.setString('HDRS', "0");
         if (puit == "1") {
            inputRecord.setString('QERY', `VTORTY, VTTX15, VTTX40 from MWORDT where VTCONO = ${this.userContext.currentCompany}`);
         }
         else if (puit == "2") {
            inputRecord.setString('QERY', `OTORTY, OTTX15, OTTX40 from MPORDT where OTCONO = ${this.userContext.currentCompany}`);

         }
         else {
            inputRecord.setString('QERY', `YXTRTP, YXTX40 from MGTYPE where YXCONO = ${this.userContext.currentCompany}`);
         }

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
                  const [ORTY, TX15, TX40] = (item.REPL || '').split(';');
                  return {
                     ...item,
                     ORTY: ORTY || '',
                     TX15: TX15 || '',
                     TX40: TX40 || '',
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
   async call_MMS200_GetItmBasicMissing(qery: string): Promise<any> {
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
   async call_ListECO_Product(qery: string): Promise<any> {
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
