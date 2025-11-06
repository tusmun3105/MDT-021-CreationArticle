import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LanguageService } from '../shared/language.service';
import { SharedService } from '../shared/shared.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from '@infor-up/m3-odin-angular';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
   selector: 'app-interface-of',
   templateUrl: './interface-of.component.html',
   styleUrls: ['./interface-of.component.css']
})
export class InterfaceOFComponent implements OnInit {
   pageTitle = "";
   //Busy indicator
   isBusyForm: boolean = false;
   // Lookups
   lookupITGR;
   lookupPRGP;
   lookupVTCP;
   lookupCSNO;
   lookupORCO;
   lookupITTY;
   lookupACRF;
   lookupDIGI;
   lookupCFI3;
   lookupDWNO;
   lookupECOP;
   lookupECRG;
   lookupUSID;
   lookupBUYE;
   lookupGRTS;
   lookupSUNO;
   lookupWCLN;
   lookupWHSL;
   lookupORTY;
   lookupCUCD;
   lookupSUWH;

   //resp lookup
   respITGR = [];
   respWHLO = [];
   respPRGP = [];
   respCSNO = [];
   respORCO = [];
   respITTY = [];
   respACRF = [];
   respVTCP = [];
   respDIGI = [];
   respCFI3 = [];
   respDWNO = [];
   respECRG = [];
   respENS015 = [];
   respUSID = [];
   respGRTS = [];
   respSUNO = [];
   respWCLN = [];
   respWHSL = [];
   respORTY = [];
   respCUCD = [];

   //Page header titles
   codeAcquisitionValue = "";
   methodPlanifValue = "";
   planningPolicyValue = "";
   typeOfRefValue = "";
   referenceModel = "";
   whlo = "";


   puit = "";

   formMITMAS = new FormGroup({
      MMITNO: new FormControl(''),
      MMSTAT: new FormControl('10'),
      MMITDS: new FormControl(''),
      MMFUDS: new FormControl(''),
      MMPRGP: new FormControl(''),
      MMWAPC: new FormControl(''),
      MMILEN: new FormControl(''),
      MMIWID: new FormControl(''),
      MMITGR: new FormControl(''),
      MMDWNO: new FormControl(''),
      M9CSNO: new FormControl(''),
      M9ORCO: new FormControl(''),
      CIECRG: new FormControl(''),
      CIECOP: new FormControl(''),
      MMGRWE: new FormControl(''),
      MMCFI3: new FormControl(''),
      MMDIGI: new FormControl(''),
   });

   formMITLAD = new FormGroup({
      LMCD_GB_ITDS: new FormControl(''),
      LMCD_GB_FUDS: new FormControl(''),
      LMCD_DE_ITDS: new FormControl(''),
      LMCD_DE_FUDS: new FormControl(''),
      LMCD_PL_ITDS: new FormControl(''),
      LMCD_PL_FUDS: new FormControl(''),
      LMCD_NL_ITDS: new FormControl(''),
      LMCD_NL_FUDS: new FormControl(''),
      LMCD_PT_ITDS: new FormControl(''),
      LMCD_PT_FUDS: new FormControl(''),
      LMCD_ES_ITDS: new FormControl(''),
      LMCD_ES_FUDS: new FormControl(''),
      LMCD_FR_ITDS: new FormControl(''),
      LMCD_FR_FUDS: new FormControl('')
   });

   formMITPOP = new FormGroup({
      POP1: new FormControl(''),
      POP2: new FormControl('')
   });

   formMITFAC = new FormGroup({
      M9ACRF: new FormControl(''),
      M9VAMT: new FormControl(''),
      MMITTY: new FormControl(''),
      MMVTCP: new FormControl(''),

   });
   formCUGEX = new FormGroup({
      DELPIC: new FormControl(''),
      DELGAM: new FormControl('')
   });

   formMITBAL = new FormGroup({
      MBRESP: new FormControl(''),
      MBBUYE: new FormControl(''),
      MBSUNO: new FormControl(''),
      MMGRTS: new FormControl(''),
      M9WCLN: new FormControl(''),
      MBWHSL: new FormControl(''),
      MBSUWH: new FormControl(''),
      MBORTY: new FormControl(''),
      CREATELINE: new FormControl(true),
   });

   formMITVEN = new FormGroup({
      IFSITE: new FormControl(''),
      IFSITT: new FormControl(''),
      MBLEA1: new FormControl(''),
      IFPUPR: new FormControl(''),
      IFPUCD: new FormControl(''),
      IFCUCD: new FormControl(''),
      IFUVDT: new FormControl(''),
      BLOCTXT: new FormControl(''),
   });
   formMITNWL = new FormGroup({
      LDF: new FormControl(false),
   });

   hideFieldMITVEN: boolean = false;
   hideFieldMITBAL: boolean = false;
   hideFieldMITNWL: boolean = false;
   hideFieldMITBALOD: boolean = false;
   hideMMS059ProgressBar: boolean = false;
   hidePDS002ProgressBar: boolean = true;
   respItemBasicMMS001: any;
   respItemBasicMMS002: any;
   respItemBasicMMS003: any;
   respItemWarehouseBasicLEA1: any;
   respItemENS015: any;
   respItemENS025: any;
   respItemDIGI: any;
   respMMS030: any;
   respAlias: any;
   respCugex: any;

   //Progress bar
   validateField = false;
   iconValidateField: string = "";
   MMS001_CUGEX = false;
   iconMMS001_CUGEX: string = "";
   MMS030 = false;
   iconMMS030: string = "";
   MMS025_CUGEX = false;
   iconMMS025_CUGEX: string = "";
   MMS002 = false;
   iconMMS002: string = "";
   MMS003 = false;
   iconMMS003: string = "";
   ENS025 = false;
   iconENS025: string = "";
   MMS059 = false;
   iconMMS059: string = "";
   PDS001 = false;
   iconPDS001: string = "";
   PDS002 = false;
   iconPDS002: string = "";
   PPS040 = false;
   iconPPS040: string = "";
   constructor(public lang: LanguageService, private shared: SharedService, private elRef: ElementRef, private renderer: Renderer2, private router: Router, private appService: ApplicationService) { }


   async ngOnInit(): Promise<void> {
      this.isBusyForm = true;
      await this.setPageTitle();
      this.onTab();
      this.initializeLookups();


      //Fetch CUCD from CRS624 when SUNO changes
      this.formMITBAL.get('MBSUNO')?.valueChanges
         .pipe(distinctUntilChanged())
         .subscribe(async (newValue: string) => {
            const respSuppCUCD = await this.shared.call_CRS620_GetSupplierCUCD(newValue?.trim());
            if (respSuppCUCD.length > 0 && !respSuppCUCD[0].error) {
               this.formMITVEN.patchValue({ IFCUCD: respSuppCUCD[0]?.CUCD });
            } else {
               this.formMITVEN.patchValue({ IFCUCD: "" });
            }
         });



      this.initializeDatepicker();
      await this.updateLookupDataset();
      this.disabledFieldsMMS030();
      [
         this.respItemBasicMMS001,
         this.respItemBasicMMS002,
         this.respAlias,
         this.respCugex,
         this.respItemENS025,
         this.respItemDIGI,
         this.respMMS030,
         this.respItemWarehouseBasicLEA1

      ] = await Promise.all([
         this.shared.call_MMS200_GetItem(window.history.state?.ITNOREF),
         this.shared.call_MMS200_GetItmWhsBasic(window.history.state?.WHLO, window.history.state?.ITNOREF),
         this.shared.call_MMS025_LstAlias(window.history.state?.ITNOREF || ''),
         this.shared.call_CUSEXT_GetFieldValue("MITMAS", window.history.state.ITNOREF),
         this.shared.call_ListECO_Product(`CIECRG, CIECRG, CIECOP from CECOCI where CICONO = ${this.shared.userContext.currentCompany} and CIITNO = ${window.history.state.ITNOREF} and CICSOR = FR`),
         this.shared.call_MMS200_GetItmBasicMissing(`MMDIGI from MITMAS where MMITNO = ${window.history.state.ITNOREF}`),
         this.shared.call_MMS200_LstItmDescLang(window.history.state.ITNOREF),
         this.shared.call_EXPORT_LEA1(window.history.state?.WHLO, window.history.state?.ITNOREF)
      ]);


      //Retrieve Language for Item description
      if (this.respMMS030.length > 0 && !this.respMMS030[0].error) {
         const supportedLangs = ["GB", "DE", "PL", "NL", "PT", "ES", "FR"];
         for (const item of this.respMMS030) {
            const lang = item?.LNCD;
            if (supportedLangs.includes(lang)) {
               this.formMITLAD.patchValue({
                  [`LMCD_${lang}_ITDS`]: item?.ITDS || "",
                  [`LMCD_${lang}_FUDS`]: item?.FUDS || "",
               });
            }
         }
      }

      if (this.respItemBasicMMS002.length > 0) {
         const faci = this.respItemBasicMMS002[0]?.FACI || '';
         const itnoref = window.history.state?.ITNOREF || '';

         const [mms003Response, wclnResponse] = await Promise.all([
            this.shared.call_MMS200_GetItmFac(faci, itnoref),
            this.shared.call_PDS010_LstWorkCenters(faci)
         ]);

         this.respItemBasicMMS003 = mms003Response;
         this.respWCLN = wclnResponse;

         if (this.respWCLN.length > 0 && !this.respWCLN[0].error) {
            this.lookupWCLN.updateDataset(this.respWCLN);
         } else {
            this.lookupWCLN.updateDataset([]);
         }
      }

      let rawECRG = "";
      let rawECOP = "";

      if (this.respItemENS025?.length > 0) {
         const repl = this.respItemENS025?.[0]?.REPL ?? "";
         rawECRG = repl.split(";")[0] || "";
         rawECOP = repl.split(";")[2] || "";

         this.formMITMAS.patchValue({
            CIECRG: rawECRG?.trim(),
            CIECOP: rawECOP?.trim(),
         });
      }



      if (this.respItemBasicMMS001.length > 0 && this.respItemBasicMMS002.length > 0 && this.respItemBasicMMS003.length > 0) {
         const itemBasic = this.respItemBasicMMS001[0];
         const itemFacBasic = this.respItemBasicMMS003[0];
         const itemWhsBasic = this.respItemBasicMMS002[0];
         const itemWhsBasicLEA1 = this.respItemWarehouseBasicLEA1[0];
         const digi = this.respItemDIGI[0]?.REPL?.split(";")[0] || ""

         this.formMITMAS.patchValue({
            MMITNO: itemBasic?.ITNO?.toUpperCase() || "",
            MMSTAT: "10",
            MMITDS: itemBasic?.ITDS || "",
            MMFUDS: itemBasic?.FUDS || "",
            MMPRGP: itemBasic?.PRGP || "",
            MMWAPC: itemBasic?.WAPC || "",
            MMILEN: itemBasic?.ILEN || "",
            MMIWID: itemBasic?.IWID || "",
            MMITGR: itemBasic?.ITGR || "",
            MMDWNO: itemBasic?.DWNO || "",
            M9CSNO: itemFacBasic?.CSNO || "",
            M9ORCO: itemFacBasic?.ORCO || "",
            MMGRWE: itemBasic?.GRWE || "",
            MMCFI3: itemBasic?.CFI3 || "",
            MMDIGI: digi
         });

         this.formMITBAL.patchValue({
            MBRESP: itemWhsBasic?.RESP || "",
            MBBUYE: itemWhsBasic?.BUYE || "",
            MBSUNO: itemWhsBasic?.SUNO || "",
            MMGRTS: itemBasic?.GRTS || "",
            MBWHSL: window.history.state?.WHLO === "10S" ? "" : (this.shared.warehouseLocationRefModel || ""),
            MBSUWH: itemWhsBasic?.SUWH || "",
            MBORTY: itemWhsBasic?.ORTY || ""
         });

         //Start of txtbloc logic
         const respTXID = await this.shared.call_EXPORT_GetIDoFTextBlock(
            itemWhsBasic?.SUNO?.trim() || "",
            itemBasic?.ITNO?.trim());

         let blockTXT = "";

         if (respTXID.length > 0 && !respTXID.error) {
            const txtblockID = respTXID[0]?.REPL?.trim();
            if (txtblockID) {
               const respTXIDLines = await this.shared.call_EXPORT_GetIDoFTextBlockLines(txtblockID);

               if (respTXIDLines.length > 0 && !respTXIDLines[0].error) {
                  // Extract line number and text, sort by line number, and join with newline
                  blockTXT = respTXIDLines
                     .map(line => {
                        const [num, text] = line.REPL.split('◉');
                        return { num: parseInt(num, 10), text: text || "" };
                     })
                     .sort((a, b) => a.num - b.num)
                     .map(l => l.text)
                     .join('\n');
               }
            }
         }
         //End of txtbloc logic

         this.formMITVEN.patchValue({
            MBLEA1: itemWhsBasicLEA1?.REPL || "",
            BLOCTXT: blockTXT
         });
         this.formMITFAC.patchValue({
            M9ACRF: itemFacBasic?.ACRF || "",
            M9VAMT: itemFacBasic?.VAMT || "0",
            MMITTY: itemBasic?.ITTY || "",
            MMVTCP: (itemBasic.VTCP ?? 0).toString().padStart(2, '0') || "00"
         });

         const setVAMT = $('#M9VAMT').data('dropdown');
         setVAMT?.setCode(this.formMITFAC.value?.M9VAMT);

         if (this.respAlias.length > 0 && !this.respAlias[0]?.error) {
            const alias = this.respAlias[0];
            const patch: any = {};

            if (alias.ALWT === "1") patch.POP1 = alias.POPN;
            else if (alias.ALWT === "2") patch.POP2 = alias.POPN;

            this.formMITPOP.patchValue(patch);
         }
         if (this.respCugex.length > 0 && !this.respCugex[0]?.error) {
            this.formCUGEX.patchValue({
               DELPIC: this.respCugex[0]?.N096,
               DELGAM: this.respCugex[0]?.N296
            });

         }

         // filter list of ORTY based on item type
         const itemType = itemBasic?.ITTY || "";

         const ortyMap: Record<string, string[]> = {
            J02: ["240", "241"],
            J03: ["240", "241"],
            J04: ["231", "232"],
            J05: ["230"]
         };

         // only filter if the itemType is in ortyMap
         this.respORTY = ortyMap[itemType]
            ? this.respORTY.filter(obj => ortyMap[itemType].includes(obj.ORTY))
            : this.respORTY;

         this.lookupORTY.updateDataset([]);
         this.lookupORTY.updateDataset(this.respORTY);


      }

      this.setLabelforSelectedValue();
      document.getElementById('MMITNO')?.focus();
      this.setupCustomTabNavigation();//tabulation
      this.isBusyForm = false;
   }
   onTab() {
      let lastFocused: HTMLElement | null = null;

      const formIds = ['formMITMAS', 'formCUGEX', 'formMITFAC', 'formMITPOP', 'formMITLAD', 'formMITBAL', 'formMITVEN'];
      const selector = formIds.map(id =>
         `form#${id} input[type="text"],
         form#${id} input[type="number"],
         form#${id} textarea,
         form#${id} .dropdown-wrapper .dropdown`
      ).join(',');

      document.addEventListener('focusin', (event) => {
         const target = event.target as HTMLElement;

         if (target && target.matches(selector)) {
            const isFakeDropdown = target.classList.contains('dropdown');
            let isDisabled = false;

            if (isFakeDropdown) {
               // Find associated real <select> element
               const selectEl = target.closest('.dropdown-wrapper')?.previousElementSibling as HTMLSelectElement;
               isDisabled = target.getAttribute('aria-disabled') === 'true' || selectEl?.disabled;
            } else {
               isDisabled =
                  (target as HTMLInputElement).disabled ||
                  target.hasAttribute('disabled') ||
                  target.getAttribute('aria-disabled') === 'true';
            }

            if (!isDisabled) {
               lastFocused = target;
            } else {
               lastFocused = null;
            }
         }
      });

      document.addEventListener('keydown', (event: KeyboardEvent) => {
         if (event.key === 'Tab' && lastFocused) {
            const el = lastFocused;

            const isDisabled =
               el.classList.contains('is-disabled') ||
               el.hasAttribute('disabled') ||
               el.getAttribute('aria-disabled') === 'true';

            if (!isDisabled) {
               el.style.setProperty('background-color', 'rgb(149, 230, 255)', 'important');
            }
         }
      });

      this.formMITMAS.patchValue({
         MMSTAT: "10"
      });

      //initialize dropdown STAT
      $('#MMSTAT').dropdown({
         attributes: [
            {
               name: 'id',
               value: 'MMSTAT'
            },
            {
               name: 'data-automation-id',
               value: 'mmstat-dropdown'
            }
         ],
         reload: 'none'
      });
      //initialize dropdown M9VAMT
      $('#M9VAMT').dropdown({
         attributes: [
            {
               name: 'id',
               value: 'M9VAMT'
            },
            {
               name: 'data-automation-id',
               value: 'm9vamt-dropdown'
            }
         ],
         reload: 'none'
      });

      const setDeaultSTAT = $('#MMSTAT').data('dropdown');
      setDeaultSTAT?.setCode('10');

      $('#MMSTAT').on('change.test', (e) => {
         const newVal = $(e.target).find(':checked').val();
         this.formMITMAS.patchValue({
            MMSTAT: newVal.toString()
         });
      });

      $('#M9VAMT').on('change.test', (e) => {
         const newVal = $(e.target).find(':checked').val();
         this.formMITFAC.patchValue({
            M9VAMT: newVal.toString()
         });
      });

   }
   async onsubmit() {
      this.resetProgressBar();
      this.isBusyForm = true;
      console.log("this.formMITMAS.value", this.formMITMAS.value)
      console.log("this.formMITFAC.value", this.formMITFAC.value)
      console.log("this.formMITBAL.value", this.formMITBAL.value)
      console.log("this.formMITLAD.value", this.formMITLAD.value)
      console.log("this.formMITPOP.value", this.formMITPOP.value)
      console.log("this.formCUGEX.value", this.formCUGEX.value)
      console.log("this.formMITVEN.value", this.formMITVEN.value)
      await this.updateLookupCIECOP();
      this.validateField = true;
      const isValid = await this.validateFields();
      if (!isValid?.valid) {
         this.isBusyForm = false;
         this.iconValidateField = "#icon-rejected-solid";
         return;
      } else {
         this.iconValidateField = "#icon-success";
      }

      const value = await this.valueMITMAS();
      const delpic = this.formCUGEX.value.DELPIC;
      const delgam = "0";
      const delchef = this.formCUGEX.value.DELGAM;
      const respCPY = await this.shared.call_MMS200_CpyItmBasicOF(value);
      this.MMS001_CUGEX = true;
      if (respCPY.length > 0 && !respCPY[0].error) {
         this.iconMMS001_CUGEX = "#icon-success";
         //     ************************     After Item creation update Basic info/ Update price// add/upd CUGEX MITMAS     ************************     \\
         // 1 Run first call
         const respUpdateACRF = await this.shared.call_MMS200_UpdItmBasic(
            value.newITNO,
            value.ACRF,
            value.ILEN,
            value.IWID
         );

         // 2 Run second call (waits for first)
         const respUpdateDIGI = await this.shared.call_MMS200_UpdItmPrice(
            value.newITNO,
            value.DIGI
         );

         // 3 Run the remaining calls simultaneously
         const [respAddCugexMitmas, respChgCugexMitmas] = await Promise.all([
            this.shared.call_CUSEXT_AddFieldValue(
               "MITMAS",
               value.newITNO,
               delpic?.toString(),
               delgam?.toString(),
               delchef?.toString(),
               ""
            ),
            this.shared.call_CUSEXT_ChgieldValue(
               "MITMAS",
               value.newITNO,
               delpic?.toString(),
               delgam?.toString(),
               delchef?.toString(),
               ""
            )
         ]);

         this.shared.displaySuccessMessage(`${this.lang.get('ERROR_TYPE')['SUCCESS']}`, `${value.newITNO} ${this.lang.get('ERROR_TYPE')['CREATED_WITH_SUCCESS']}`);

         //     ************************     MMS030 - MITLAD     ************************     \\
         this.MMS030 = true;
         const values_MITLAD = {
            LMCD_GB_ITDS: (this.formMITLAD.value.LMCD_GB_ITDS ?? '').toString().trim(),
            LMCD_GB_FUDS: (() => {
               const itds = (this.formMITLAD.value.LMCD_GB_ITDS ?? '').toString().trim();
               const fuds = (this.formMITLAD.value.LMCD_GB_FUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            LMCD_DE_ITDS: (this.formMITLAD.value.LMCD_DE_ITDS ?? '').toString().trim(),
            LMCD_DE_FUDS: (() => {
               const itds = (this.formMITLAD.value.LMCD_DE_ITDS ?? '').toString().trim();
               const fuds = (this.formMITLAD.value.LMCD_DE_FUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            LMCD_PL_ITDS: (this.formMITLAD.value.LMCD_PL_ITDS ?? '').toString().trim(),
            LMCD_PL_FUDS: (() => {
               const itds = (this.formMITLAD.value.LMCD_PL_ITDS ?? '').toString().trim();
               const fuds = (this.formMITLAD.value.LMCD_PL_FUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            LMCD_NL_ITDS: (this.formMITLAD.value.LMCD_NL_ITDS ?? '').toString().trim(),
            LMCD_NL_FUDS: (() => {
               const itds = (this.formMITLAD.value.LMCD_NL_ITDS ?? '').toString().trim();
               const fuds = (this.formMITLAD.value.LMCD_NL_FUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            LMCD_PT_ITDS: (this.formMITLAD.value.LMCD_PT_ITDS ?? '').toString().trim(),
            LMCD_PT_FUDS: (() => {
               const itds = (this.formMITLAD.value.LMCD_PT_ITDS ?? '').toString().trim();
               const fuds = (this.formMITLAD.value.LMCD_PT_FUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            LMCD_ES_ITDS: (this.formMITLAD.value.LMCD_ES_ITDS ?? '').toString().trim(),
            LMCD_ES_FUDS: (() => {
               const itds = (this.formMITLAD.value.LMCD_ES_ITDS ?? '').toString().trim();
               const fuds = (this.formMITLAD.value.LMCD_ES_FUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            LMCD_FR_ITDS: (this.formMITLAD.value.LMCD_FR_ITDS ?? '').toString().trim(),
            LMCD_FR_FUDS: (() => {
               const itds = (this.formMITLAD.value.LMCD_FR_ITDS ?? '').toString().trim();
               const fuds = (this.formMITLAD.value.LMCD_FR_FUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
         };

         const countries = ['GB', 'DE', 'PL', 'NL', 'PT', 'ES', 'FR'];

         const promises = countries
            .filter(code => values_MITLAD[`LMCD_${code}_ITDS`]?.trim() !== '')
            .map(code => {
               const itds = values_MITLAD[`LMCD_${code}_ITDS`];
               const fud = values_MITLAD[`LMCD_${code}_FUDS`];
               return this.shared.call_MMS030_Add(value.newITNO, code, itds, fud);
            });

         await Promise.all(promises);
         this.iconMMS030 = "#icon-success"

         //     ************************     Item Alias - MMS025     ************************     \\
         this.MMS025_CUGEX = true;
         const values_MITPOP = {
            POP1: (this.formMITPOP.value.POP1 ?? '').toString().trim(),
            POP2: (this.formMITPOP.value.POP2 ?? '').toString().trim(),
         }

         const aliases = [
            { type: '1', value: values_MITPOP.POP1, qualifier: '' },
            { type: '2', value: values_MITPOP.POP2, qualifier: 'EA13 ' }
         ];

         const popPromises = aliases
            .filter(alias => alias.value !== '')
            .map(alias => this.shared.call_MMS025_AddAlias(alias.type, value.newITNO, alias.value, alias.qualifier));

         const respAlias = await Promise.all(popPromises);
         this.iconMMS025_CUGEX = "#icon-success";

         //     ************************     Add CUGEX MITPOP     ************************     \\
         const popCUGEXPromisesAdd = aliases
            .filter(alias => alias.value !== '')
            .map(alias => this.shared.call_CUSEXT_AddFieldValue("MITPOP", value.newITNO, alias.type, alias.qualifier, alias.value, this.shared.userContext.currentDivision));

         await Promise.all(popCUGEXPromisesAdd);

         const popCUGEXPromisesChg = aliases
            .filter(alias => alias.value !== '')
            .map(alias => this.shared.call_CUSEXT_ChgieldValue("MITPOP", value.newITNO, alias.type, alias.qualifier, alias.value, this.shared.userContext.currentDivision));

         await Promise.all(popCUGEXPromisesChg);

         //     ************************     ENS025     ************************     \\
         this.ENS025 = true;
         if (this.formMITMAS.value.CIECRG?.trim() != "" && this.formMITMAS.value.CIECOP?.trim() != "") {
            await this.launchENS025Create(this.formMITMAS.value.CIECRG, this.formMITMAS.value.CIECOP, this.formMITMAS.value.MMITNO.toUpperCase());
         }
         this.iconENS025 = "#icon-success";

         //     ************************     Creation of Item in Depot/Facility Supplier for all interfaces     ************************     \\
         const valueMITBAL = await this.valueMITBAL();
         const puit = window.history.state?.PUIT;
         if (puit == "3" && valueMITBAL.SUWH != "") {
            const respWhsSupp = await this.shared.call_MMS200_CpyItmWhsOF_Supplier(valueMITBAL);
         }
         //     ************************     Creation of Item in Depot/Facility Client for all interfaces     ************************     \\
         let valueMITFAC = await this.valueMITFAC(valueMITBAL);

         this.MMS002 = true;
         const respWhsClient = await this.shared.call_MMS200_CpyItmWhsOF_Client(valueMITBAL, value);
         if (respWhsClient.length > 0 && respWhsClient[0].error) {
            this.iconMMS002 = "#icon-rejected-solid";
         }
         else {
            const lea1Value = this.formMITVEN.value.MBLEA1?.toString()?.trim() || "0";
            const respWhsLEA1 = await this.shared.call_MMS200_UpdItmWhsBasicLEA1(
               window.history.state?.WHLO,
               value.newITNO,
               lea1Value
            );
            this.MMS003 = true;
            const respECCC = await this.shared.call_MMS200_GetItmFac(valueMITBAL?.FACI, valueMITBAL?.refModelArticle);
            valueMITFAC.ECCC = "";
            if (respECCC.length > 0 && !respECCC[0].error) {
               valueMITFAC.ECCC = respECCC[0]?.ECCC;
            }
            const respFaciClient = await this.shared.call_MMS200_UpdItmFacOF_Client(valueMITBAL, valueMITFAC);
            if (respFaciClient.length > 0 && respFaciClient[0].error) {
               this.iconMMS003 = "#icon-rejected-solid";
            }
            else {
               this.iconMMS003 = "#icon-success";
            }
            this.iconMMS002 = "#icon-success";
         }


         // ************************     MMS059     ************************ \\
         this.MMS059 = true;

         if (this.formMITNWL.value.LDF) {
            const respMMS059_List = await this.shared.call_MMS059_List("ADV1");

            if (respMMS059_List.length > 0 && !respMMS059_List[0].error) {
               // Get all matching records
               const matchingRecords = respMMS059_List.filter(
                  (rec: any) =>
                     rec.SPLM?.toString()?.trim() === "ADV1" &&
                     // rec.PREX?.toString()?.trim() === "4" &&
                     rec.SPLA?.toString()?.trim() === "1" &&
                     rec.OBV1?.toString()?.trim() === valueMITBAL.refModelArticle?.trim()
               );

               if (matchingRecords.length > 0) {
                  let allSuccess = true;

                  for (const record of matchingRecords) {
                     const orty = valueMITBAL?.ORTY || "";
                     const newORTY = orty.startsWith("ITJ") ? "240" : "200";

                     const respMMS059Aadd = await this.shared.call_MMS059_Add(record, value.newITNO, newORTY);

                     if (respMMS059Aadd.length > 0 && respMMS059Aadd[0].error) {
                        allSuccess = false;
                     }
                  }

                  // Set icon based on overall result
                  this.iconMMS059 = allSuccess ? "#icon-success" : "#icon-rejected-solid";
               } else {
                  this.iconMMS059 = "#icon-rejected-solid";
               }
            }
         } else {
            this.iconMMS059 = "#icon-success";
         }

         // ************************     PDS001     ************************ \\
         if (window.history.state?.PUIT == "1") {
            this.PDS001 = true;
            await this.launchPDS001Copy(valueMITBAL?.FACI?.trim(), valueMITBAL?.refModelArticle, "STD", valueMITBAL?.newITNO?.trim());
            await new Promise(resolve => setTimeout(resolve, 2500));
            const respCheckPDS001 = await this.shared.call_PDS001_GetProductStructure(valueMITBAL?.FACI?.trim(), valueMITBAL?.newITNO?.trim(), "STD");
            if (respCheckPDS001.length > 0 && !respCheckPDS001[0].error) {
               this.iconPDS001 = "#icon-success";
               const dcon = value?.CHCD === "1" ? "1" : "0";

               const respUpdatePDS001 = await this.shared.call_PDS001_Update(
                  valueMITBAL?.FACI?.trim(),
                  valueMITBAL?.newITNO?.trim(),
                  "10",
                  "STD",
                  value?.RESP,
                  value?.DWNO,
                  dcon
               );

               // ************************     PDS002     ************************ \\
               this.PDS002 = true;
               if (this.formMITBAL.value.CREATELINE) {
                  this.PDS002 = true;

                  const respListCompoPDS002 = await this.shared.call_PDS002_LstComponent(
                     valueMITBAL?.FACI?.trim(),
                     window.history.state?.ITNOREF,
                     "STD"
                  );

                  const respLstOperationPDS002 = await this.shared.call_PDS002_LstOperation(
                     valueMITBAL?.FACI?.trim(),
                     window.history.state?.ITNOREF,
                     "STD"
                  );

                  if (respListCompoPDS002.length > 0 && !respListCompoPDS002[0].error) {
                     await Promise.all(
                        respListCompoPDS002.map(item => this.shared.call_PDS002_CreateComponent(item, valueMITBAL?.newITNO?.trim(), valueMITBAL?.WHLO?.trim()))
                     );
                  }

                  if (respLstOperationPDS002.length > 0 && !respLstOperationPDS002[0].error) {
                     await Promise.all(
                        respLstOperationPDS002.map(item => this.shared.call_PDS002_CreateOperation(item, valueMITBAL?.newITNO?.trim(), valueMITBAL.SUNO))
                     );
                  }

               } else {
                  // ************************     PDS002 -Delete Mats & Ops   ************************ \\
                  this.PDS002 = true;

                  const respListCompoPDS002 = await this.shared.call_PDS002_LstComponent(
                     valueMITBAL?.FACI?.trim(),
                     window.history.state?.ITNOREF,
                     "STD"
                  );

                  const respLstOperationPDS002 = await this.shared.call_PDS002_LstOperation(
                     valueMITBAL?.FACI?.trim(),
                     window.history.state?.ITNOREF,
                     "STD"
                  );

                  if (respListCompoPDS002.length > 0 && !respListCompoPDS002[0].error) {
                     await Promise.all(
                        respListCompoPDS002.map(item => this.shared.call_PDS002_DeleteCompoNOperation(item, valueMITBAL?.newITNO?.trim()))
                     );
                  }

                  if (respLstOperationPDS002.length > 0 && !respLstOperationPDS002[0].error) {
                     await Promise.all(
                        respLstOperationPDS002.map(item => this.shared.call_PDS002_DeleteCompoNOperation(item, valueMITBAL?.newITNO?.trim()))
                     );
                  }
               }
               this.iconPDS002 = "#icon-success";
            }
            else {
               this.iconPDS001 = "#icon-rejected-solid";
               this.PDS002 = true;
               this.iconPDS002 = "#icon-rejected-solid";
            }
         }
         // ************************     PPS040    ************************ \\
         if (window.history.state?.PUIT == "2") {
            this.PPS040 = true;
            const valMITVEN = await this.valueMITVEN();
            if (this.hideFieldMITVEN == false) {
               const respSuppBUYE = await this.shared.call_CRS620_GetSupplierCUCD(valueMITBAL.SUNO);
               let buyer = "";
               if (respSuppBUYE.length > 0 && !respSuppBUYE[0].error) {
                  buyer = respSuppBUYE[0]?.BUYE;
               }
               const respPPS040 = await this.shared.call_PPS040_AddItemSupplier(value.newITNO, valueMITBAL.SUNO, valMITVEN.PUPR, valMITVEN.PUCD, valMITVEN.UVDT, buyer);
               if (respPPS040.length > 0 && respPPS040[0].error) {
                  this.iconPPS040 = "#icon-rejected-solid";
               }
               else {
                  this.iconPPS040 = "#icon-success";
                  const lines = valMITVEN.BLOCTXT?.split('\n') || [];
                  if (lines.length && lines[lines.length - 1].trim() === '') {
                     lines.pop();
                  }
                  const respUpdatePPS040 = await this.shared.call_PPS040_UpdItemSupplier(value.newITNO, valueMITBAL.SUNO, "1", "20", valueMITFAC.M9ORCO, valMITVEN.SITE, valMITVEN.SITT,);
                  if (lines.length != 0) {
                     const respAddTextBlockToSupplierItem = await this.shared.call_AddTextBlockToSupplierItem(value.newITNO, valueMITBAL.SUNO, lines);
                  }
               }
            }
         }
         this.isBusyForm = false;
      }
      else {
         this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, respCPY[0].errorMessage.errorMessage);
         this.iconMMS001_CUGEX = "#icon-rejected-solid";
         this.isBusyForm = false;
         return;
      }
   }

   initializeLookups() {
      const columnNamesMitmas = this.lang.get('MITMAS_FIELD_LABELS');
      const columnNamesMitfac = this.lang.get('MITFAC_FIELD_LABELS');
      const columnNamesCecoci = this.lang.get('CECOCI_FIELD_LABELS');
      const columnNamesMitbal = this.lang.get('MITBAL_FIELD_LABELS');
      const columnNamesMitven = this.lang.get('MITVEN_FIELD_LABELS');

      const TX15 = this.lang.get('TX15');
      const TX40 = this.lang.get('TX40');

      const fields = [
         { key: 'ITGR', inputId: 'MMITGR', colId: 'ITGR', labelSet: columnNamesMitmas },
         { key: 'PRGP', inputId: 'MMPRGP', colId: 'PRGP', labelSet: columnNamesMitmas },
         { key: 'VTCD', inputId: 'MMVTCP', colId: 'VTCD', labelSet: columnNamesMitmas },
         { key: 'M9CSNO', inputId: 'M9CSNO', colId: 'CSNO', labelSet: columnNamesMitfac },
         { key: 'M9ORCO', inputId: 'M9ORCO', colId: 'CSCD', labelSet: columnNamesMitfac },
         { key: 'ITTY', inputId: 'MMITTY', colId: 'ITTY', labelSet: columnNamesMitmas },
         { key: 'M9ACRF', inputId: 'M9ACRF', colId: 'ACRF', labelSet: columnNamesMitfac },
         { key: 'DIGI', inputId: 'MMDIGI', colId: 'DIGI', labelSet: columnNamesMitmas },
         { key: 'CFI3', inputId: 'MMCFI3', colId: 'CFI3', labelSet: columnNamesMitmas },
         { key: 'DWNO', inputId: 'MMDWNO', colId: 'DWNO', labelSet: columnNamesMitmas },
         { key: 'ECOP', inputId: 'CIECOP', colId: 'ECOP', labelSet: columnNamesCecoci },
         { key: 'ECRG', inputId: 'CIECRG', colId: 'ECRG', labelSet: columnNamesCecoci },
         { key: 'USID', inputId: 'MBRESP', colId: 'USID', labelSet: columnNamesMitbal },
         { key: 'USID', inputId: 'MBBUYE', colId: 'USID', labelSet: columnNamesMitbal },
         { key: 'GRTS', inputId: 'MMGRTS', colId: 'GRTS', labelSet: columnNamesMitbal },
         { key: 'SUNO', inputId: 'MBSUNO', colId: 'SUNO', labelSet: columnNamesMitbal },
         { key: 'WCLN', inputId: 'M9WCLN', colId: 'WCLN', labelSet: columnNamesMitfac },
         { key: 'WHSL', inputId: 'MBWHSL', colId: 'WHSL', labelSet: columnNamesMitbal },
         { key: 'ORTY', inputId: 'MBORTY', colId: 'ORTY', labelSet: columnNamesMitbal },
         { key: 'SUWH', inputId: 'MBSUWH', colId: 'SUWH', labelSet: columnNamesMitbal },
         { key: 'CUCD', inputId: 'IFCUCD', colId: 'CUCD', labelSet: columnNamesMitven },

      ];
      fields.forEach(field => {
         let columns = [
            { id: field.colId, name: field.labelSet[field.inputId], field: field.colId, formatter: Soho.Formatters.Text, filterType: 'text' },
            { id: 'TX15', name: TX15, field: 'TX15', formatter: Soho.Formatters.Text, filterType: 'text' },
            { id: 'TX40', name: TX40, field: 'TX40', formatter: Soho.Formatters.Text, filterType: 'text' }
         ];
         let removeTX40For = ["DWNO", "USID", "SUNO", "WCLN", "WHSL", "SUWH"];
         if (window.history.state?.PUIT == "3") {
            removeTX40For.push("ORTY");
         }

         if (removeTX40For.includes(field.colId)) {
            columns = columns.filter(col => col.id !== "TX40");
         }

         const lookupInstance = $(`#${field.inputId}`).lookup({
            field: field.colId,
            autoApply: true,
            options: {
               columns,
               dataset: [],
               selectable: 'single',
               filterable: true,
               rowNavigation: true,
               paging: false,
               pagesize: 50
            }
         }).data('lookup');

         const MITMAS_FIELDS = ['MMITGR', 'MMPRGP', 'M9CSNO', 'M9ORCO', 'MMDIGI', 'MMCFI3', 'MMDWNO', 'CIECOP', 'CIECRG'];
         const MITFAC_FIELDS = ['MMVTCP', 'MMITTY', 'M9ACRF'];
         const MITBAL_FIELDS = ['MBRESP', 'MBBUYE', 'MMGRTS', 'MBSUNO', 'M9WCLN', 'MBWHSL', 'MBORTY', 'MBSUWH'];
         const MITVEN_FIELDS = ['IFCUCD'];

         switch (field.inputId) {
            case 'MMITGR': this.lookupITGR = lookupInstance; break;
            case 'MMPRGP': this.lookupPRGP = lookupInstance; break;
            case 'MMVTCP': this.lookupVTCP = lookupInstance; break;
            case 'M9CSNO': this.lookupCSNO = lookupInstance; break;
            case 'M9ORCO': this.lookupORCO = lookupInstance; break;
            case 'MMITTY': this.lookupITTY = lookupInstance; break;
            case 'M9ACRF': this.lookupACRF = lookupInstance; break;
            case 'MMDIGI': this.lookupDIGI = lookupInstance; break;
            case 'MMCFI3': this.lookupCFI3 = lookupInstance; break;
            case 'MMDWNO': this.lookupDWNO = lookupInstance; break;
            case 'CIECOP': this.lookupECOP = lookupInstance; break;
            case 'CIECRG': this.lookupECRG = lookupInstance; break;
            case 'MBRESP': this.lookupUSID = lookupInstance; break;
            case 'MBBUYE': this.lookupBUYE = lookupInstance; break;
            case 'MMGRTS': this.lookupGRTS = lookupInstance; break;
            case 'MBSUNO': this.lookupSUNO = lookupInstance; break;
            case 'M9WCLN': this.lookupWCLN = lookupInstance; break;
            case 'MBWHSL': this.lookupWHSL = lookupInstance; break;
            case 'MBORTY': this.lookupORTY = lookupInstance; break;
            case 'IFCUCD': this.lookupCUCD = lookupInstance; break;
            case 'MBSUWH': this.lookupSUWH = lookupInstance; break;
         }

         $(`#${field.inputId}`).on('change', (e, args) => {
            if (args && args[0] && args[0].data) {
               let formGroup;

               if (MITMAS_FIELDS.includes(field.inputId)) {
                  formGroup = this.formMITMAS;
               } else if (MITFAC_FIELDS.includes(field.inputId)) {
                  formGroup = this.formMITFAC;
               } else if (MITBAL_FIELDS.includes(field.inputId)) {
                  formGroup = this.formMITBAL;
               } else if (MITVEN_FIELDS.includes(field.inputId)) {
                  formGroup = this.formMITVEN;
               }

               if (formGroup) {
                  formGroup.patchValue({ [field.inputId]: args[0].data[field.colId] });
               }
            }

            this.setLabelforSelectedValue();
         });

         const input = document.getElementById(field.inputId);
         input?.addEventListener('keydown', function (event) {
            if (event.key === 'F4') {
               event.preventDefault();
               const wrapper = input.closest('.lookup-wrapper');
               const btn = wrapper?.querySelector('button.btn-icon.trigger') as HTMLButtonElement;
               btn?.click();
            }
         });
      });
   }
   async updateLookupDataset() {
      [
         this.respITGR,
         this.respPRGP,
         this.respCSNO,
         this.respORCO,
         this.respITTY,
         this.respACRF,
         this.respVTCP,
         this.respDIGI,
         this.respCFI3,
         this.respDWNO,
         this.respECRG,
         this.respUSID,
         this.respGRTS,
         this.respSUNO,
         this.respWHSL,
         this.respORTY,
         this.respCUCD,
         this.respWHLO
      ] = await Promise.all([
         this.shared.call_CRS025_LstItemGroup(),
         this.shared.call_EXPORT_LstPurchaseGroup(),
         this.shared.call_CRS128_LstByNumber(),
         this.shared.call_CRS045_LstCountry(),
         this.shared.call_CRS040_LstItemTypes(),
         this.shared.call_CRS335_LstCtrlObj(),
         this.shared.call_CRS030_LstVAT(),
         this.shared.call_EXPORT_LstItemDiscountGroup(),
         this.shared.call_EXPORT_LstItemMatiereCFI3(),
         this.shared.call_CRS230_LstDocID(),
         this.shared.call_ENS010_LstEcoOrg(),
         this.shared.call_MNS150_LstResp(),
         this.shared.call_MMS043__LstDistributionGroupTech(),
         this.shared.call_CRS620_LstSuppliers(),
         this.shared.call_MMS010_LstEmplacement(window.history.state?.WHLO || ""),
         this.shared.call_LstOrderType(this.shared.userContext.currentCompany, window.history.state?.PUIT),
         this.shared.call_EXPORT_LstCurrency(),
         this.shared.call_MMS005_LstWarehouses()
      ]);

      this.lookupITGR?.updateDataset(this.respITGR.length > 0 && this.respITGR[0].error ? [] : this.respITGR);
      this.lookupPRGP?.updateDataset(this.respPRGP.length > 0 && this.respPRGP[0].error ? [] : this.respPRGP);
      this.lookupCSNO?.updateDataset(this.respCSNO.length > 0 && this.respCSNO[0].error ? [] : this.respCSNO);
      this.lookupORCO?.updateDataset(this.respORCO.length > 0 && this.respORCO[0].error ? [] : this.respORCO);
      this.lookupITTY?.updateDataset(this.respITTY.length > 0 && this.respITTY[0].error ? [] : this.respITTY);
      this.lookupACRF?.updateDataset(this.respACRF.length > 0 && this.respACRF[0].error ? [] : this.respACRF);
      this.lookupVTCP?.updateDataset(this.respVTCP.length > 0 && this.respVTCP[0].error ? [] : this.respVTCP);
      this.lookupDIGI?.updateDataset(this.respDIGI.length > 0 && this.respDIGI[0].error ? [] : this.respDIGI);
      this.lookupCFI3?.updateDataset(this.respCFI3.length > 0 && this.respCFI3[0].error ? [] : this.respCFI3);
      this.lookupDWNO?.updateDataset(this.respDWNO.length > 0 && this.respDWNO[0].error ? [] : this.respDWNO);
      this.lookupECOP?.updateDataset([]);
      this.lookupECRG?.updateDataset(this.respECRG.length > 0 && this.respECRG[0].error ? [] : this.respECRG);
      this.lookupUSID?.updateDataset(this.respUSID.length > 0 && this.respUSID[0].error ? [] : this.respUSID);
      this.lookupBUYE?.updateDataset(this.respUSID.length > 0 && this.respUSID[0].error ? [] : this.respUSID);
      this.lookupGRTS?.updateDataset(this.respGRTS.length > 0 && this.respGRTS[0].error ? [] : this.respGRTS);
      this.lookupSUNO?.updateDataset(this.respSUNO.length > 0 && this.respSUNO[0].error ? [] : this.respSUNO);
      this.lookupWCLN?.updateDataset([]);
      this.lookupWHSL?.updateDataset(this.respWHSL.length > 0 && this.respWHSL[0].error ? [] : this.respWHSL);
      this.lookupCUCD?.updateDataset(this.respCUCD.length > 0 && this.respCUCD[0].error ? [] : this.respCUCD);
      this.lookupSUWH?.updateDataset(this.respWHLO.length > 0 && this.respWHLO[0].error ? [] : this.respWHLO);
      if (this.respORTY.length > 0 && this.respORTY[0].error) {
         this.respORTY = [];
      }

      // When lookup for CIECOP is clicked then perform this
      const ciecopButton = document.querySelector('#CIECOP + button.trigger');

      if (ciecopButton) {
         ciecopButton.addEventListener('click', async () => {
            this.updateLookupCIECOP();
         });
      }

   }

   setPageTitle() {
      // Set page title from history state
      this.pageTitle = window.history.state?.Title || '';
      //Set WHLO
      this.whlo = window.history.state?.WHLO;
      // Helper to get acquisition and reference titles based on PUIT
      const puit = window.history.state?.PUIT;
      if (puit && ['1', '2', '3'].includes(puit)) {
         this.codeAcquisitionValue = `${puit} - ${this.lang.get('HEADER_TITLE_CODE_AQ')[puit]}`;
         this.typeOfRefValue = this.lang.get('REFERENCE_TITLE')[puit];
         this.referenceModel = this.lang.get('REFERENCE_MODEL')[puit];
      } else {
         this.codeAcquisitionValue = '';
         this.typeOfRefValue = '';
      }

      // Set planning method title based on OPLC
      const oplc = window.history.state?.OPLC;
      if (oplc !== undefined && this.lang.get('HEADER_TITLE_METH_PLAN').hasOwnProperty(oplc)) {
         this.methodPlanifValue = `${oplc} - ${this.lang.get('HEADER_TITLE_METH_PLAN')[oplc]}`;
      } else {
         this.methodPlanifValue = '';
      }



      // Set planning policy value
      this.planningPolicyValue = window.history.state?.PLCD || '';
      if (puit == "1" || puit == "3") {
         this.hideFieldMITVEN = true;
      }
      if (puit == "2" || puit == "3") {
         this.hideFieldMITBAL = true;
      }
      if (puit != "2") {
         this.hideFieldMITNWL = true;
      }
      if (puit == "3") {
         this.hideFieldMITBALOD = true;
      }
      if (puit == "1" || puit == "2") {
         this.hideMMS059ProgressBar = false;
      }
      else if (puit == "3") {
         this.hideMMS059ProgressBar = true;
      }

      if (puit == "1") {
         this.puit = "1";
      }
   }

   initializeDatepicker() {
      const $input = $('#IFUVDT');

      if ($input.length) {
         $input.datepicker({
            dateFormat: 'dd/MM/yyyy',
         });
      } else {
         console.warn("Element #IFUVDT not found");
      }
      $('input#IFUVDT').on('change', (e) => {
         const newVal = $(e.target).val();
         this.formMITVEN.patchValue({
            IFUVDT: newVal.toString(),
         });
      });
   }


   disabledFieldsMMS030() {
      const countries = ['GB', 'DE', 'PL', 'NL', 'PT', 'ES', 'FR'];

      countries.forEach(code => {
         const inputField = `LMCD_${code}_ITDS`;
         const targetField = `LMCD_${code}_FUDS`;

         const inputControl = this.formMITLAD.get(inputField);
         const targetControl = this.formMITLAD.get(targetField);

         if (inputControl && targetControl) {
            inputControl.valueChanges.subscribe((value: string) => {
               const hasValue = value?.trim() !== '';
               if (hasValue) {
                  targetControl.enable();
               } else {
                  targetControl.disable();
               }
            });

            // Initial state setup
            const hasValue = inputControl.value?.trim() !== '';
            if (hasValue) {
               targetControl.enable();
            } else {
               targetControl.disable();
            }
         }
      });
   }
   async validateFields(): Promise<{ valid: boolean; itemBasic: any }> {
      const getValue = (form: any, key: string, upper = false) => {
         let val = (form?.[key] ?? "").toString().trim();
         return upper ? val.toUpperCase() : val;
      };

      // Collect values
      const values = {
         MMITNO: getValue(this.formMITMAS.value, "MMITNO", true),
         MMPRGP: getValue(this.formMITMAS.value, "MMPRGP"),
         MMITGR: getValue(this.formMITMAS.value, "MMITGR"),
         MMDIGI: getValue(this.formMITMAS.value, "MMDIGI"),
         MMCFI3: getValue(this.formMITMAS.value, "MMCFI3"),
         MMDWNO: getValue(this.formMITMAS.value, "MMDWNO"),
         M9CSNO: getValue(this.formMITMAS.value, "M9CSNO"),
         M9ORCO: getValue(this.formMITMAS.value, "M9ORCO"),

         MMVTCP: getValue(this.formMITFAC.value, "MMVTCP"),
         M9ACRF: getValue(this.formMITFAC.value, "M9ACRF"),
         MMITTY: getValue(this.formMITFAC.value, "MMITTY"),

         CIECRG: getValue(this.formMITMAS.value, "CIECRG"),
         CIECOP: getValue(this.formMITMAS.value, "CIECOP"),

         MBRESP: getValue(this.formMITBAL.value, "MBRESP"),
         MBBUYE: getValue(this.formMITBAL.value, "MBBUYE"),
         MBSUNO: getValue(this.formMITBAL.value, "MBSUNO"),
         MMGRTS: getValue(this.formMITBAL.value, "MMGRTS"),
         M9WCLN: getValue(this.formMITBAL.value, "M9WCLN"),
         MBWHSL: getValue(this.formMITBAL.value, "MBWHSL"),
         MBSUWH: getValue(this.formMITBAL.value, "MBSUWH"),
         MBORTY: getValue(this.formMITBAL.value, "MBORTY"),

         POP1: getValue(this.formMITPOP.value, "POP1"),
         POP2: getValue(this.formMITPOP.value, "POP2"),
         PUPR: getValue(this.formMITVEN.value, "IFPUPR"),
      };

      // Validation mapping
      let validations = [
         { key: "MMPRGP", list: this.respPRGP, field: "PRGP", label: this.lang.get("MITMAS_FIELD_LABELS").MMPRGP },
         { key: "MMITGR", list: this.respITGR, field: "ITGR", label: this.lang.get("MITMAS_FIELD_LABELS").MMITGR },
         { key: "MMDWNO", list: this.respDWNO, field: "DWNO", label: this.lang.get("MITMAS_FIELD_LABELS").MMDWNO },
         { key: "M9CSNO", list: this.respCSNO, field: "CSNO", label: this.lang.get("MITFAC_FIELD_LABELS").M9CSNO },
         { key: "M9ORCO", list: this.respORCO, field: "CSCD", label: this.lang.get("MITFAC_FIELD_LABELS").M9ORCO },
         { key: "CIECRG", list: this.respECRG, field: "ECRG", label: this.lang.get("CECOCI_FIELD_LABELS").CIECRG },
         { key: "CIECOP", list: this.respENS015, field: "ECOP", label: this.lang.get("CECOCI_FIELD_LABELS").CIECOP },
         { key: "MMCFI3", list: this.respCFI3, field: "CFI3", label: this.lang.get("MITMAS_FIELD_LABELS").MMCFI3 },
         { key: "MMDIGI", list: this.respDIGI, field: "DIGI", label: this.lang.get("MITMAS_FIELD_LABELS").MMDIGI },
         { key: "MBRESP", list: this.respUSID, field: "USID", label: this.lang.get("MITBAL_FIELD_LABELS").MBRESP },
         { key: "MBBUYE", list: this.respUSID, field: "USID", label: this.lang.get("MITBAL_FIELD_LABELS").MBBUYE },
         { key: "MBSUNO", list: this.respSUNO, field: "SUNO", label: this.lang.get("MITBAL_FIELD_LABELS").MBSUNO },
         { key: "MBORTY", list: this.respORTY, field: "ORTY", label: this.lang.get("MITBAL_FIELD_LABELS").MBORTY },
         { key: "MMGRTS", list: this.respGRTS, field: "GRTS", label: this.lang.get("MITBAL_FIELD_LABELS").MMGRTS },
         { key: "M9WCLN", list: this.respWCLN, field: "WCLN", label: this.lang.get("MITFAC_FIELD_LABELS").M9WCLN },
         { key: "MBWHSL", list: this.respWHSL, field: "WHSL", label: this.lang.get("MITBAL_FIELD_LABELS").MBWHSL },
         { key: "MBSUWH", list: this.respWHLO, field: "SUWH", label: this.lang.get("MITBAL_FIELD_LABELS").MBSUWH },
         { key: "M9ACRF", list: this.respACRF, field: "ACRF", label: this.lang.get("MITFAC_FIELD_LABELS").M9ACRF },
         { key: "MMITTY", list: this.respITTY, field: "ITTY", label: this.lang.get("MITMAS_FIELD_LABELS").MMITTY },
         { key: "MMVTCP", list: this.respVTCP, field: "VTCD", label: this.lang.get("MITMAS_FIELD_LABELS").MMVTCP },
      ];
      if (window.history.state?.PUIT == "1" || window.history.state?.PUIT == "3") {
         validations = validations.filter(v => v.key !== "M9WCLN");
      }
      if (window.history.state?.PUIT != "3") {
         validations = validations.filter(v => v.key !== "MBSUWH");
      }



      // Mandatory check for item number
      if (!values.MMITNO) {
         this.shared.displayErrorMessage(this.lang.get("ERROR_TYPE").ERROR,
            `${this.lang.get("MITMAS_FIELD_LABELS").MMITNO} ${this.lang.get("ERROR_TYPE").MANDATORY_FIELD}`);
         document.getElementById("MMITNO")?.focus();
         return { valid: false, itemBasic: {} };
      }
      // Mandatory check for location
      if (!values.MBWHSL) {
         this.shared.displayErrorMessage(this.lang.get("ERROR_TYPE").ERROR,
            `${this.lang.get("MITBAL_FIELD_LABELS").MBWHSL} ${this.lang.get("ERROR_TYPE").MANDATORY_FIELD}`);
         document.getElementById("MBWHSL")?.focus();
         return { valid: false, itemBasic: {} };
      }

      // Check if item already exists
      const respCheckItem = await this.shared.call_MMS200_GetItem(values.MMITNO);
      if (respCheckItem.length > 0 && !respCheckItem[0].error) {
         this.shared.displayErrorMessage(this.lang.get("ERROR_TYPE").ERROR,
            `${values.MMITNO} ${this.lang.get("ERROR_TYPE").ALREADY_EXIST}`);
         document.getElementById("MMITNO")?.focus();
         return { valid: false, itemBasic: {} };
      }

      // decimal check
      if (!isNaN(Number(values.PUPR)) && Number(values.PUPR) !== 0) {
         const dccd = this.respItemBasicMMS001[0]?.PDCC?.trim(); // Expected decimal count from item master
         const pupValue = values.PUPR.toString().trim();

         if (dccd && /^\d+$/.test(dccd)) {
            const expectedDecimals = parseInt(dccd, 10);

            // Determine actual number of decimals in PUPR
            const actualDecimals = pupValue.includes('.') ? pupValue.split('.')[1].length : 0;

            // Show error only if actual decimals exceed allowed
            if (actualDecimals > expectedDecimals) {
               this.shared.displayErrorMessage(
                  this.lang.get("ERROR_TYPE").ERROR,
                  `${values.MMITNO} ${this.lang.get("ERROR_TYPE").INVALID_DECIMAL} ${expectedDecimals}`
               );

               document.getElementById("IFPUPR")?.focus();
               return { valid: false, itemBasic: {} };
            }

         }
      }



      // Run field validations
      for (const { key, list, field, label } of validations) {
         let value = values[key];
         if (key === "MMVTCP" && value) value = value.padStart(2, "0");

         if (value && !list.some(item => item?.[field] === value)) {
            this.shared.displayErrorMessage(this.lang.get("ERROR_TYPE").ERROR,
               `${label} ${value} ${this.lang.get("ERROR_TYPE").NOT_VALID}`);
            document.getElementById(key)?.focus();
            return { valid: false, itemBasic: {} };
         }
      }

      // POP2 → EAN13 validation
      if (values.POP2) {
         const ean = values.POP2;
         if (ean.length !== 13) {
            this.shared.displayErrorMessage(this.lang.get("ERROR_TYPE").ERROR,
               this.lang.get("ERROR_TYPE").NO_CHARS_EAN13);
            document.getElementById("POP2")?.focus();
            return { valid: false, itemBasic: {} };
         }

         if (!this.isValidEAN13(ean)) {
            this.shared.displayErrorMessage(this.lang.get("ERROR_TYPE").ERROR,
               this.lang.get("ERROR_TYPE").ERROR_EAN13);
            document.getElementById("POP2")?.focus();
            return { valid: false, itemBasic: {} };
         }

         const respEA13 = await this.shared.call_MMS025_CheckIfExistEA13(
            `MPPOPN from MITPOP where MPCONO = ${this.shared.userContext.currentCompany} and MPALWT = 2 and MPALWQ = EA13 and MPPOPN = ${ean}`
         );
         if (respEA13.length > 0) {
            this.shared.displayErrorMessage(this.lang.get("ERROR_TYPE").ERROR,
               `EAN13 ${ean} ${this.lang.get("ERROR_TYPE").ALREADY_EXIST}`);
            document.getElementById("POP2")?.focus();
            return { valid: false, itemBasic: {} };
         }
      }

      return { valid: true, itemBasic: values };
   }

   // Helper for EAN13
   private isValidEAN13(ean: string): boolean {
      const digits = ean.split("").map(d => parseInt(d, 10));
      const sumOdd = digits.filter((_, i) => i % 2 === 0 && i < 12).reduce((a, b) => a + b, 0);
      const sumEven = digits.filter((_, i) => i % 2 === 1 && i < 12).reduce((a, b) => a + b, 0);
      const checkDigit = (10 - ((sumOdd + sumEven * 3) % 10)) % 10;
      return checkDigit === digits[12];
   }


   setLabelforSelectedValue() {

      const fields = [
         { key: 'ITGR', inputId: 'MMITGR', colId: 'ITGR', dataset: this.respITGR },
         { key: 'DWNO', inputId: 'MMDWNO', colId: 'DWNO', dataset: this.respDWNO },
         { key: 'PRGP', inputId: 'MMPRGP', colId: 'PRGP', dataset: this.respPRGP },
         { key: 'CSNO', inputId: 'M9CSNO', colId: 'CSNO', dataset: this.respCSNO },
         { key: 'M9ORCO', inputId: 'M9ORCO', colId: 'CSCD', dataset: this.respORCO },
         { key: 'ITTY', inputId: 'MMITTY', colId: 'ITTY', dataset: this.respITTY },
         { key: 'M9ACRF', inputId: 'M9ACRF', colId: 'ACRF', dataset: this.respACRF },
         { key: 'VTCD', inputId: 'MMVTCP', colId: 'VTCD', dataset: this.respVTCP },
         { key: 'DIGI', inputId: 'MMDIGI', colId: 'DIGI', dataset: this.respDIGI },
         { key: 'CFI3', inputId: 'MMCFI3', colId: 'CFI3', dataset: this.respCFI3 },
         { key: 'ECRG', inputId: 'CIECRG', colId: 'ECRG', dataset: this.respECRG },
         { key: 'ECOP', inputId: 'CIECOP', colId: 'ECOP', dataset: this.respENS015 },
         { key: 'RESP', inputId: 'MBRESP', colId: 'USID', dataset: this.respUSID },
         { key: 'BUYE', inputId: 'MBBUYE', colId: 'USID', dataset: this.respUSID },
         { key: 'SUNO', inputId: 'MBSUNO', colId: 'SUNO', dataset: this.respSUNO },
         { key: 'GRTS', inputId: 'MMGRTS', colId: 'GRTS', dataset: this.respGRTS },
         { key: 'WCLN', inputId: 'M9WCLN', colId: 'WCLN', dataset: this.respWCLN },
         { key: 'WHSL', inputId: 'MBWHSL', colId: 'WHSL', dataset: this.respWHSL },
         { key: 'ORTY', inputId: 'MBORTY', colId: 'ORTY', dataset: this.respORTY },
         { key: 'CUCD', inputId: 'IFCUCD', colId: 'CUCD', dataset: this.respCUCD },
         { key: 'SUWH', inputId: 'MBSUWH', colId: 'SUWH', dataset: this.respWHLO }
      ];

      fields.forEach(field => {
         const input = document.getElementById(field.inputId) as HTMLInputElement;
         const span = document.getElementById(`${field.inputId}SelectedValue`);

         if (!input || !span) {
            console.warn(`Input or span not found for ${field.inputId}`);
            return;
         }

         // Add listener for input changes
         input.addEventListener('input', () => {
            const inputValue = input.value;
            const datasetArray = Array.isArray(field.dataset) ? field.dataset : [field.dataset];

            const record = datasetArray.find(d => d?.[field.colId] === inputValue);
            if (record) {
               span.textContent = record.TX15 || "";
            } else {
               span.textContent = "";
            }
         });

         // Optional: trigger once on setup to initialize span
         input.dispatchEvent(new Event('input'));
      });
   }

   setupCustomTabNavigation() {
      if (window.history.state?.PUIT == "1") {
         const navigationMap: { [key: string]: string } = {
            'MMPRGP': 'MMWAPC',
            'MMITGR': 'MMDWNO',
            'MMDWNO': 'M9CSNO',
            'M9CSNO': 'M9ORCO',
            'M9ORCO': 'CIECRG',
            'CIECRG': 'CIECOP',
            'CIECOP': 'MMGRWE',
            'MMGRWE': 'MMCFI3',
            'MMCFI3': 'MMDIGI',

            'MMDIGI': 'MBRESP',
            'MBRESP': 'MBBUYE',
            'MBBUYE': 'MBSUNO',
            'MBSUNO': 'M9WCLN',
            'M9WCLN': 'MBWHSL',
            'MBWHSL': "MBORTY",
            'MBORTY': "CREATELINE",
            'CREATELINE': 'LMCD_GB_ITDS',

            'POP2': 'M9ACRF',
            'M9ACRF': 'MMITTY',
            'MMVTCP': 'DELPIC',
            'DELPIC': 'DELGAM',
            'DELGAM': 'MMITNO',
         };

         document.addEventListener('keydown', (event: KeyboardEvent) => {
            const active = document.activeElement as HTMLElement;
            const activeId = active?.id;
            if (!activeId) return;

            if (event.key === 'Tab' || event.key.toUpperCase() === 'F4') {
               if (navigationMap[activeId]) {
                  event.preventDefault();
                  document.getElementById(navigationMap[activeId])?.focus();
               }
            }
         });
      }
      else if (window.history.state?.PUIT == "2") {
         const navigationMap: { [key: string]: string } = {
            'MMPRGP': 'MMWAPC',
            'MMITGR': 'MMDWNO',
            'MMDWNO': 'M9CSNO',
            'M9CSNO': 'M9ORCO',
            'M9ORCO': 'CIECRG',
            'CIECRG': 'CIECOP',
            'CIECOP': 'MMGRWE',
            'MMGRWE': 'MMCFI3',
            'MMCFI3': 'MMDIGI',

            'MMDIGI': 'MBRESP',
            'MBRESP': 'MBBUYE',
            'MBBUYE': 'MBSUNO',
            'MBSUNO': 'MMGRTS',
            'MMGRTS': 'MBWHSL',
            'MBWHSL': 'MBORTY',
            'MBORTY': 'IFSITE',
            'IFCUCD': 'IFUVDT',
            'IFUVDT': "BLOCTXT",
            'BLOCTXT': "LMCD_GB_ITDS",
            'M9ACRF': 'MMITTY',

            'MMVTCP': 'DELPIC',
            "LDF": "MMITNO"
         };

         document.addEventListener('keydown', (event: KeyboardEvent) => {
            const active = document.activeElement as HTMLElement;
            const activeId = active?.id;
            if (!activeId) return;

            if (event.key === 'Tab' || event.key.toUpperCase() === 'F4') {
               if (navigationMap[activeId]) {
                  event.preventDefault();
                  document.getElementById(navigationMap[activeId])?.focus();
               }
            }
         });
      }
      else if (window.history.state?.PUIT == "3") {
         const navigationMap: { [key: string]: string } = {
            'MMPRGP': 'MMWAPC',
            'MMITGR': 'MMDWNO',
            'MMDWNO': 'M9CSNO',
            'M9CSNO': 'M9ORCO',
            'M9ORCO': 'CIECRG',
            'CIECRG': 'CIECOP',
            'CIECOP': 'MMGRWE',
            'MMCFI3': 'MMDIGI',

            'MMDIGI': 'MBRESP',
            'MBRESP': 'MBBUYE',
            'MBBUYE': 'MBWHSL',
            'MBWHSL': 'MBSUWH',
            'MBSUWH': 'MBORTY',
            'MBORTY': 'LMCD_GB_ITDS',
            'M9ACRF': 'MMITTY',
            'MMVTCP': "DELPIC",
            'DELGAM': "MMITNO"
         };

         document.addEventListener('keydown', (event: KeyboardEvent) => {
            const active = document.activeElement as HTMLElement;
            const activeId = active?.id;
            if (!activeId) return;

            if (event.key === 'Tab' || event.key.toUpperCase() === 'F4') {
               if (navigationMap[activeId]) {
                  event.preventDefault();
                  document.getElementById(navigationMap[activeId])?.focus();
               }
            }
         });
      }
   }

   async valueMITMAS(): Promise<any> {
      let value: any = {};
      const respItemBasic = this.respItemBasicMMS001?.[0];
      value.newITNO = this.formMITMAS.value.MMITNO?.toUpperCase();
      const puit = window.history.state?.PUIT;
      if (puit == "1") {
         value.refModelArticle = "T111000000";
      } else if (puit == "2") {
         value.refModelArticle = "T112000000";
      } else if (puit == "3") {
         value.refModelArticle = "T113000000";
      }
      value.STAT = this.formMITMAS.value.MMSTAT;
      value.ITDS = (this.formMITMAS.value.MMITDS ?? '?').toString().trim();
      value.FUDS = (() => {
         const itds = (this.formMITMAS.value.MMITDS ?? '?').toString().trim();
         const fuds = (this.formMITMAS.value.MMFUDS ?? '?').toString().trim();
         return !fuds && itds ? itds : fuds;
      })();
      value.RESP = respItemBasic?.RESP;
      value.DCCD = respItemBasic?.DCCD;
      value.UNMS = respItemBasic?.UNMS;
      value.ITTY = this.formMITFAC.value.MMITTY;
      value.CHCD = respItemBasic?.CHCD;
      value.STCD = respItemBasic?.STCD;
      value.GRWE = this.formMITMAS.value.MMGRWE;
      value.WAPC = this.formMITMAS.value.MMWAPC;
      value.HIE3 = this.formMITMAS.value.MMITGR;
      value.CFI3 = this.formMITMAS.value.MMCFI3;
      value.PRGP = this.formMITMAS.value.MMPRGP;
      value.GRTS = this.formMITBAL.value.MMGRTS;
      value.SALE = respItemBasic?.SALE;
      value.ATMO = respItemBasic?.ATMO;
      value.ATMN = respItemBasic?.ATMN;
      value.DIGI = this.formMITMAS.value.MMDIGI;
      value.TPCD = this.formMITMAS.value.MMDIGI;
      value.NEWE = this.formMITMAS.value.MMGRWE;
      value.PPUN = respItemBasic?.UNMS;
      value.ITGR = this.formMITMAS.value.MMITGR;
      // HIE1 = first character of ITGR
      value.HIE1 = this.formMITMAS.value.MMITGR
         ? this.formMITMAS.value.MMITGR.substring(0, 1)
         : "";

      // HIE2 = first 4 characters of ITGR
      value.HIE2 = this.formMITMAS.value.MMITGR
         ? this.formMITMAS.value.MMITGR.substring(0, 4)
         : "";

      value.ACRF = "YYYYYYYY";
      value.PUUN = respItemBasic?.UNMS;
      value.ALUC = "";
      value.TPLI = respItemBasic?.ITNO;
      value.STUN = respItemBasic?.UNMS;
      value.SPUN = respItemBasic?.UNMS;
      value.ALUN = respItemBasic?.UNMS;
      value.DWNO = this.formMITMAS.value.MMDWNO;


      // VTCP = if ITTY == "J00" then "00", else ""
      value.VTCP = this.formMITFAC.value.MMITTY === "J00" ? "00" : this.formMITFAC.value.MMVTCP ?? "00";

      // VTCS = conditional assignment based on SALE and STCD
      if (respItemBasic?.SALE === 1 && respItemBasic?.STCD === 1) {
         value.VTCS = "0";
      } else if (respItemBasic?.SALE === 0) {
         value.VTCS = "0";
      } else {
         value.VTCS = "0";
      }

      value.CPUN = respItemBasic?.UNMS;
      value.TPCD = "0";

      const objCtrlComp = this.formMITFAC.value.M9ACRF;

      const itty = this.formMITFAC.value.MMITTY;


      if (itty == "G00" || itty == "H00" || itty == "I00") {
         value.INDI = "3";
         value.BACD = "2";
      } else if (itty == "A00" && objCtrlComp == "ITA01") {
         value.INDI = "3";
         value.BACD = "0";
      } else if ((itty == "A00" || itty == "B00" || itty == "D00" || itty == "E00" || itty == "F00") && (objCtrlComp != "ITA01")) {
         value.INDI = "0";
         value.BACD = "0";
      } else if (itty == "C00") {
         value.INDI = "0";
         value.BACD = "0";
      } else if (itty >= "J00") {
         value.INDI = "0";
         value.BACD = "0";
      } else {
         value.INDI = "0";
         value.BACD = "0";
      }
      // fetch TPCD
      const respTPCD = await this.shared.call_CRS040_GetTPCDFromITTY(this.formMITFAC.value.MMITTY);
      if (respTPCD.length > 0) {
         value.TPCD = respTPCD[0]?.REPL;
      }

      //DIGI
      value.DIGI = (this.formMITMAS.value.MMDIGI ?? '')?.toString()?.trim();

      //IWID && ILEN
      value.IWID = (this.formMITMAS.value.MMIWID ?? '0')?.toString()?.trim();
      value.ILEN = (this.formMITMAS.value.MMILEN ?? '0')?.toString()?.trim();
      return value;
   }

   async valueMITBAL(): Promise<any> {
      let value: any = {};
      const respItemWhs = this.respItemBasicMMS002?.[0];

      value.newITNO = this.formMITMAS.value.MMITNO?.toUpperCase();
      value.CONO = this.shared.userContext.currentCompany;
      value.DIVI = this.shared.userContext.currentDivision;
      value.WHLO = window.history.state?.WHLO;
      value.STAT = respItemWhs?.STAT;
      value.RESP = this.formMITBAL.value.MBRESP;
      value.BUYE = this.formMITBAL.value.MBBUYE;
      value.SUNO = this.formMITBAL.value.MBSUNO;
      value.ORTY = this.formMITBAL.value.MBORTY;
      value.PLCD = respItemWhs?.PLCD;
      value.PUIT = respItemWhs?.PUIT;
      value.SUWH = this.formMITBAL.value.MBSUWH;
      value.SATD = respItemWhs?.SATD;
      value.FACI = respItemWhs?.FACI;
      value.WHSL = this.formMITBAL.value.MBWHSL;

      value.FACI_SUPP = "";
      value.WHLO_SUPP = "";
      value.refITNO = window.history.state?.ITNOREF;


      const puit = window.history.state?.PUIT;
      if (puit == "1") {
         value.refModelArticle = "T111000000";
      } else if (puit == "2") {
         value.refModelArticle = "T112000000";
      } else if (puit == "3") {
         value.refModelArticle = "T113000000";
      }
      if (puit == "3" && value.SUWH != "") {
         const respWHLO = await this.shared.call_MMS005_GetWarehouse(value.SUWH);
         if (respWHLO.length > 0 && !respWHLO[0].error) {
            value.FACI_SUPP = respWHLO[0]?.FACI;
            value.WHLO_SUPP = respWHLO[0]?.WHLO;
         }
      }
      if (puit == "2") {
         value.LEA1 = this.formMITVEN.value?.MBLEA1?.toString();
      } else {
         value.LEA1 = respItemWhs?.LEA1?.toString();
      }
      const objCtrlComp = this.formMITFAC.value.M9ACRF;

      const itty = this.formMITFAC.value.MMITTY;

      if (itty == "G00" || itty == "H00" || itty == "I00") {
         value.SPMT = "4";
         value.ALMT = "2";
      } else if (itty == "A00" && objCtrlComp == "ITA01") {
         value.SPMT = "6";
         value.ALMT = "1";
      } else if ((itty == "A00" || itty == "B00" || itty == "D00" || itty == "E00" || itty == "F00") && (objCtrlComp != "ITA01")) {
         value.SPMT = "4";
         value.ALMT = "2";
      } else if (itty == "C00") {
         value.SPMT = "4";
         value.ALMT = "2";
      } else if (itty >= "J00") {
         value.SPMT = "4";
         value.ALMT = "2";
      } else {
         value.SPMT = "4";
         value.ALMT = "2";
      }

      return value;
   }
   async valueMITFAC(valMitbal: any): Promise<any> {
      let value: any = {};
      value.ACRF = this.formMITFAC.value.M9ACRF;
      value.CSNO = this.formMITMAS.value.M9CSNO;
      value.ORCO = this.formMITMAS.value.M9ORCO;
      value.VAMT = this.formMITFAC.value.M9VAMT?.toString();
      value.REWH = valMitbal.WHLO;
      value.WCLN = this.formMITBAL.value.M9WCLN;
      return value;
   }
   async valueMITVEN(): Promise<any> {
      let value: any = {};
      value.SITE = this.formMITVEN.value.IFSITE?.toString();
      value.SITT = this.formMITVEN.value.IFSITT?.toString();
      value.PUPR = this.formMITVEN.value.IFPUPR?.toString().trim();
      if (!value.PUPR || value.PUPR === "?") {
         value.PUPR = "0";
      }

      value.PUCD = this.formMITVEN.value.IFPUCD?.toString().trim();
      if (!value.PUCD || value.PUCD === "?") {
         value.PUCD = "0";
      }

      value.UVDT = this.formMITVEN.value.IFUVDT?.toString();
      const yyyymmdd = (d: string) => d.split('/').reverse().join('');
      value.UVDT = yyyymmdd(value.UVDT);
      value.BLOCTXT = this.formMITVEN.value.BLOCTXT?.toString()?.trim();
      return value;
   }

   async updateLookupCIECOP() {
      try {
         const respENS015 = await this.shared.call_ListECO_Product(
            `CGECOP, CGTX15, CGTX40 from CECOPC where CGCONO = ${this.shared.userContext.currentCompany} and CGECRG = ${this.formMITMAS.value.CIECRG?.trim()} and CGCSOR = 'FR'`
         );

         if (respENS015.length > 0) {
            const repl = respENS015[0]?.REPL ?? "";
            this.respENS015 = respENS015.map(item => {
               const [ECOP = "", TX15 = "", TX40 = ""] = (item.REPL || "").split(";");
               return {
                  ECOP: ECOP.trim(),
                  TX15: TX15.trim(),
                  TX40: TX40.trim(),
               };
            });

            this.lookupECOP?.updateDataset(this.respENS015);
         } else {
            this.lookupECOP?.updateDataset([]);
         }
         this.setLabelforSelectedValue();
      } catch (error) {
         console.error("Error fetching ENS015:", error);
      }
   }
   async launchENS025Create(org: string, contri: string, item: string) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = String(today.getFullYear()).slice(-2);
      const ddMMyy = `${day}${month}${year}`;

      let xmlTemplate = `<?xml version="1.0" encoding="utf-8"?>
      <sequence>
          <step command="RUN" value="ENS025" />
          <step command="AUTOSET">
              <field name="WBQTTP">1</field>
              <field name="W1OBKV">{{org}}</field>
              <field name="W2OBKV">FR</field>
              <field name="W3OBKV">{{contri}}</field>
              <field name="W4OBKV">{{item}}</field>
          </step>
          <step command="KEY" value="ENTER" />
          <step command="LSTOPT" value="-1" />
          <step command="AUTOSET">
              <field name="WEVFDT">{{fromdate}}</field>
              <field name="WEVTDT"></field>
          </step>
          <step command="KEY" value="ENTER" />
          <step command="KEY" value="F3" />
      </sequence>
      `;

      const replacements: Record<string, string> = {
         '{{org}}': org?.trim(),
         '{{contri}}': contri?.trim(),
         '{{item}}': item?.trim(),
         '{{fromdate}}': ddMMyy,
      };

      Object.entries(replacements).forEach(([key, value]) => {
         xmlTemplate = xmlTemplate.replace(new RegExp(key, 'g'), value);
      });

      console.log("xmlTemplate", xmlTemplate);

      const prefix = `mforms://_automation?data=${encodeURIComponent(xmlTemplate)}`;
      return this.appService.launch(prefix);
   }
   async launchPDS001Copy(faci: string, cpyprno: string, strt: string, newprno: string) {
      let xmlTemplate = `<?xml version="1.0" encoding="utf-8"?>
    <sequence>
        <step command="RUN" value="PDS001" />
        <step command="AUTOSET">
            <field name="WWQTTP">1</field>
            <field name="W1OBKV">{{faci}}</field>
            <field name="W2OBKV">{{cpyprno}}</field>
            <field name="W3OBKV">{{strt}}</field>
        </step>
        <step command="KEY" value="ENTER" />
        <step command="LSTOPT" value="3" />
        <step command="AUTOSET">
            <field name="CPFACI">{{faci}}</field>
            <field name="CPPRNO">{{newprno}}</field>
            <field name="CPSTRT">{{strt}}</field>
            <field name="CPCPOP">0</field>
            <field name="WCCPPV">0</field>
        </step>
        <step command="KEY" value="ENTER" />
        <step command="KEY" value="F3" />
    </sequence>`;

      const replacements: Record<string, string> = {
         '{{faci}}': faci?.trim(),
         '{{cpyprno}}': cpyprno?.trim(),
         '{{strt}}': strt?.trim(),
         '{{newprno}}': newprno?.trim() // if needed later
      };

      Object.entries(replacements).forEach(([key, value]) => {
         xmlTemplate = xmlTemplate.replace(new RegExp(key, 'g'), value);
      });

      console.log("xmlTemplate", xmlTemplate);

      const prefix = `mforms://_automation?data=${encodeURIComponent(xmlTemplate)}`;
      return this.appService.launch(prefix);
   }


   resetProgressBar() {
      this.validateField = false;
      this.iconValidateField = "";
      this.MMS001_CUGEX = false;
      this.iconMMS001_CUGEX = "";
      this.MMS030 = false;
      this.iconMMS030 = "";
      this.MMS025_CUGEX = false;
      this.iconMMS025_CUGEX = "";
      this.MMS002 = false;
      this.iconMMS002 = "";
      this.MMS003 = false;
      this.iconMMS003 = "";
      this.ENS025 = false;
      this.iconENS025 = "";
      this.MMS059 = false;
      this.iconMMS059 = "";
      this.PDS001 = false;
      this.iconPDS001 = "";
      this.PDS002 = false;
      this.iconPDS002 = "";
      this.PPS040 = false;
      this.iconPPS040 = "";
   }

   handleInput(event: Event) {
      const control = this.formMITVEN.get('BLOCTXT');
      const textarea = event.target as HTMLTextAreaElement;
      if (!control || !textarea) return;

      let value = textarea.value || '';
      let cursorPos = textarea.selectionStart;

      const lines = value.split('\n');
      const newLines: string[] = [];
      let charsPassed = 0;

      for (let line of lines) {
         while (line.length > 60) {
            newLines.push(line.slice(0, 60));
            line = line.slice(60);
            if (cursorPos > charsPassed + 60) {
               charsPassed += 60;
            } else {
               // Cursor is in this line, set it at the end
               cursorPos = newLines.join('\n').length + line.length + 1;
            }
         }
         newLines.push(line);
         charsPassed += line.length + 1;
      }

      const newValue = newLines.join('\n');
      if (newValue !== value) {
         control.setValue(newValue, { emitEvent: false });
         textarea.value = newValue;
         textarea.selectionStart = textarea.selectionEnd = cursorPos;
      }
   }





}
