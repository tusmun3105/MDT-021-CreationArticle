import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LanguageService } from '../shared/language.service';
import { SharedService } from '../shared/shared.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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

   //resp lookup
   respITGR = [];
   respPRGP = [];
   respCSNO = [];
   respORCO = [];
   respITTY = [];
   respACRF = [];
   respVTCP = [];
   respDIGI = [];
   respCFI3 = [];
   respDWNO = [];
   respECOP = [];
   respECRG = [];
   respUSID = [];
   respGRTS = [];
   respSUNO = [];
   respWCLN = [];
   respWHSL = [];

   //Page header titles
   codeAcquisitionValue = "";
   methodPlanifValue = "";
   planningPolicyValue = "";
   typeOfRefValue = "";
   referenceModel = "";
   whlo = "";

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
      LDF: new FormControl(true),
   });

   hideFieldMITVEN: boolean = false;
   hideFieldMITBAL: boolean = false;
   hideFieldMITNWL: boolean = false;
   respItemBasicMMS001: any;
   respItemBasicMMS002: any;
   respItemBasicMMS003: any;
   respAlias: any;
   respCugex: any;

   constructor(public lang: LanguageService, private shared: SharedService, private elRef: ElementRef, private renderer: Renderer2, private router: Router) { }


   async ngOnInit(): Promise<void> {
      this.setPageTitle();
      this.onTab();
      this.initializeLookups();
      this.initializeDatepicker();
      this.updateLookupDataset();
      this.disabledFieldsMMS030();
      [
         this.respItemBasicMMS001,
         this.respItemBasicMMS002,
         this.respAlias,
         this.respCugex
      ] = await Promise.all([
         this.shared.call_MMS200_GetItem(window.history.state?.ITNOREF || ''),
         this.shared.call_MMS200_GetItmWhsBasic(window.history.state?.WHLO || '', window.history.state?.ITNOREF || ''),
         this.shared.call_MMS025_LstAlias(window.history.state?.ITNOREF || ''),
         this.shared.call_CUSEXT_GetFieldValue("MITMAS", window.history.state.ITNOREF)
      ]);
      if (this.respItemBasicMMS002.length > 0) {
         this.respItemBasicMMS003 = await this.shared.call_MMS200_GetItmFac(this.respItemBasicMMS002[0]?.FACI || '', window.history.state?.ITNOREF || '');
      }
      if (this.respItemBasicMMS001.length > 0 && this.respItemBasicMMS002.length > 0 && this.respItemBasicMMS003.length > 0) {
         const itemBasic = this.respItemBasicMMS001[0];
         const itemFacBasic = this.respItemBasicMMS003[0];
         const itemWhsBasic = this.respItemBasicMMS002[0];

         this.formMITMAS.patchValue({
            MMITNO: itemBasic?.ITNO || "",
            MMSTAT: itemBasic?.STAT || "",
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
            CIECRG: itemBasic?.ECRG || "",
            CIECOP: itemBasic?.ECOP || "",
            MMGRWE: itemBasic?.GRWE || "",
            MMCFI3: itemBasic?.CFI3 || "",
            MMDIGI: itemBasic?.DIGI || ""
         });

         this.formMITBAL.patchValue({
            MBRESP: itemWhsBasic?.RESP || "",
            MBBUYE: itemWhsBasic?.BUYE || "",
            MBSUNO: itemWhsBasic?.SUNO || "",
            MMGRTS: itemWhsBasic?.GRTS || "",
            MBWHSL: itemWhsBasic?.WHSL || "",
         });

         this.formMITFAC.patchValue({
            M9ACRF: itemFacBasic?.CSNO || "",
            M9VAMT: itemFacBasic?.VAMT || "",
            MMITTY: itemBasic?.ITTY || "",
            MMVTCP: itemBasic?.VTCP || "",
         });
         if (this.respAlias.length > 0 && !this.respAlias[0]?.error) {
            const alias = this.respAlias[0];
            const patch: any = {};

            if (alias.ALWT === "1") patch.POP1 = alias.POPN;
            else if (alias.ALWT === "2") patch.POP2 = alias.POPN;

            this.formMITPOP.patchValue(patch);
         }
         if (this.respCugex.length > 0 && !this.respCugex[0]?.error) {
            this.formMITPOP.patchValue({
               POP1: this.respCugex[0]?.N096,
               POP2: this.respCugex[0]?.N196
            });

         }

      }

      document.getElementById('MMITNO')?.focus();

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
         console.log(newVal);
         this.formMITMAS.patchValue({
            MMSTAT: newVal.toString()
         });
      });

      $('#M9VAMT').on('change.test', (e) => {
         const newVal = $(e.target).find(':checked').val();
         console.log(newVal);
         this.formMITFAC.patchValue({
            M9VAMT: newVal.toString()
         });
      });

   }
   async onsubmit() {

   }

   initializeLookups() {
      const columnNamesMitmas = this.lang.get('MITMAS_FIELD_LABELS');
      const columnNamesMitfac = this.lang.get('MITFAC_FIELD_LABELS');
      const columnNamesCecoci = this.lang.get('CECOCI_FIELD_LABELS');

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
         { key: 'USID', inputId: 'MBRESP', colId: 'USID', labelSet: columnNamesCecoci },//
         { key: 'USID', inputId: 'MBBUYE', colId: 'USID', labelSet: columnNamesCecoci },//
         { key: 'GRTS', inputId: 'MMGRTS', colId: 'GRTS', labelSet: columnNamesCecoci },//
         { key: 'SUNO', inputId: 'MBSUNO', colId: 'SUNO', labelSet: columnNamesCecoci },//
         { key: 'WCLN', inputId: 'M9WCLN', colId: 'WCLN', labelSet: columnNamesCecoci },//
         { key: 'WHSL', inputId: 'MBWHSL', colId: 'WHSL', labelSet: columnNamesCecoci },//

      ];

      fields.forEach(field => {
         let columns = [
            { id: field.colId, name: field.labelSet[field.inputId], field: field.colId, formatter: Soho.Formatters.Text, filterType: 'text' },
            { id: 'TX15', name: TX15, field: 'TX15', formatter: Soho.Formatters.Text, filterType: 'text' },
            { id: 'TX40', name: TX40, field: 'TX40', formatter: Soho.Formatters.Text, filterType: 'text' }
         ];
         const removeTX40For = ["DWNO", "USID", "SUNO", "WCLN", "WHSL"];

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
               rowNavigation: true,
               toolbar: {
                  results: true,
                  keywordFilter: true,
                  advancedFilter: false,
                  actions: false,
                  rowHeight: false,
                  collapsibleFilter: false,
                  fullWidth: true
               },
               paging: false,
               pagesize: 50
            }
         }).data('lookup');

         const MITMAS_FIELDS = ['MMITGR', 'MMPRGP', 'M9CSNO', 'M9ORCO', 'MMDIGI', 'MMCFI3', 'MMDWNO', 'CIECOP', 'CIECRG'];
         const MITFAC_FIELDS = ['MMVTCP', 'MMITTY', 'M9ACRF'];
         const MITBAL_FIELDS = ['MBRESP', 'MBBUYE', 'MMGRTS', 'MBSUNO', 'M9WCLN', 'MBWHSL'];

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
               }

               if (formGroup) {
                  formGroup.patchValue({ [field.inputId]: args[0].data[field.colId] });
               }
            }
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
      this.isBusyForm = true;
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
         this.respECOP,
         this.respECRG,
         this.respUSID,
         this.respGRTS,
         this.respSUNO,
         this.respWCLN,
         this.respWHSL
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
         this.shared.call_ENS015_LstEcoContri(),
         this.shared.call_ENS010_LstEcoOrg(),
         this.shared.call_MNS150_LstResp(),
         this.shared.call_MMS043__LstDistributionGroupTech(),
         this.shared.call_CRS620_LstSuppliers(),
         this.shared.call_PDS010_LstWorkCenters(window.history.state?.FACI || ""),
         this.shared.call_MMS010_LstEmplacement(window.history.state?.WHLO || ""),
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
      this.lookupECOP?.updateDataset(this.respECOP.length > 0 && this.respECOP[0].error ? [] : this.respECOP);
      this.lookupECRG?.updateDataset(this.respECRG.length > 0 && this.respECRG[0].error ? [] : this.respECRG);
      this.lookupUSID?.updateDataset(this.respUSID.length > 0 && this.respUSID[0].error ? [] : this.respUSID);
      this.lookupBUYE?.updateDataset(this.respUSID.length > 0 && this.respUSID[0].error ? [] : this.respUSID);
      this.lookupGRTS?.updateDataset(this.respGRTS.length > 0 && this.respGRTS[0].error ? [] : this.respGRTS);
      this.lookupSUNO?.updateDataset(this.respSUNO.length > 0 && this.respSUNO[0].error ? [] : this.respSUNO);
      this.lookupWCLN?.updateDataset(this.respWCLN.length > 0 && this.respWCLN[0].error ? [] : this.respWCLN);
      this.lookupWHSL?.updateDataset(this.respWHSL.length > 0 && this.respWHSL[0].error ? [] : this.respWHSL);

      this.isBusyForm = false;

   }

   setPageTitle() {
      console.log("window.history.state", window.history.state)
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
      console.log("puit", puit)
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
   }

   initializeDatepicker() {
      $('#IFUVDT')
         .datepicker({
            dateFormat: 'dd/MM/yyyy',
         })
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
}
