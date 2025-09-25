import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LanguageService } from '../shared/language.service';
import { SharedService } from '../shared/shared.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
   selector: 'app-interface-kit-fg',
   templateUrl: './interface-kit-fg.component.html',
   styleUrls: ['./interface-kit-fg.component.css']
})
export class InterfaceKITFGComponent implements OnInit {
   pageTitle = "";
   //Busy indicator
   isBusyForm: boolean = true;
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

   formMITMAS = new FormGroup({
      MMITNO: new FormControl(''),
      MMSTAT: new FormControl('10'),
      MMITDS: new FormControl(''),
      MMFUDS: new FormControl(''),
      MMPRGP: new FormControl(''),
      MMITGR: new FormControl(''),
      M9CSNO: new FormControl(''),
      M9ORCO: new FormControl(''),
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
      MMITTY: new FormControl(''),
      MMVTCP: new FormControl(''),

   });
   formCUGEX = new FormGroup({
      DELPIC: new FormControl(''),
      DELGAM: new FormControl('')
   });


   //Progess Bar FG
   validateStepFG: boolean = false;
   copyItemBasicStepFG: boolean = false;
   updateItemBasicStepFG: boolean = false;
   languageFG: boolean = false;
   iconUpdatePriceFG: string = "";
   copyItemBasicFG: string = "";
   validateFieldsFG: string = "";
   iconLanguageFG: string = "";
   hideFieldMITFAC: boolean = false;
   hideFieldMITLAD: boolean = false;
   hideFieldCUGEX: boolean = false;
   iconAliasFG: string = "";
   aliasFG = false;

   //Progess Bar KIT
   validateFieldsKIT = false;
   copyItemBasicKIT = false;
   copyItemFacilityKIT = false;
   updateItemPriceKIT = false;
   cugex1KIT = false;
   languageKIT = false;
   aliasKIT = false;
   iconValidateFieldsKIT: string = "";
   iconCopyItemBasicKIT: string = "";
   iconCopyItemFacilityKIT: string = "";
   iconUpdateItemPriceKIT: string = "";
   iconCUGEX1KIT: string = "";
   iconLanguageKIT: string = "";
   iconAliasKIT: string = "";

   respItemBasicSelectedItem = {};
   respItemFaci = {};
   referenceModel: string = "";

   constructor(public lang: LanguageService, private shared: SharedService, private elRef: ElementRef, private renderer: Renderer2, private router: Router) { }

   async ngOnInit(): Promise<void> {
      this.onTab();
      this.initializeLookups();
      this.pageTitle = window.history.state.Title;
      if (this.pageTitle != "KIT") {
         this.setupCustomTabNavigation();//tabulation

         //Hide field CUGEX and MITFAC if FG
         this.hideFieldMITFAC = true;
         this.hideFieldCUGEX = true;

         this.referenceModel = this.lang.get('REFERENCE_MODEL')['FG'];
      } else {
         this.referenceModel = this.lang.get('REFERENCE_MODEL')['KIT'];
         this.setupCustomTabNavigation();//tabulation
      }

      const [respItemBasic, respCugex, respMM200DIGI_ACRF, respFACI, respMMS030List] = await Promise.all([
         this.shared.call_MMS200_GetItem(window.history.state.ITNOREF),
         this.shared.call_CUSEXT_GetFieldValue("MITMAS", window.history.state.ITNOREF),
         this.shared.call_MMS200_GetItmDIGI_ACRF(`MMDIGI, MMACRF from MITMAS where MMITNO = ${window.history.state.ITNOREF}`),
         this.shared.call_MMS200_GetItmFac(window.history.state.FACI, window.history.state.ITNOREF),
         this.shared.call_MMS030_List(window.history.state.ITNOREF)
      ]);

      //Retrieve Language for Item description
      if (respMMS030List.length > 0 && !respMMS030List[0].error) {
         const supportedLangs = ["GB", "DE", "PL", "NL", "PT", "ES", "FR"];
         for (const item of respMMS030List) {
            const lang = item?.LNCD;
            const refTtem = item?.ITNO?.trim();
            if (supportedLangs.includes(lang) && refTtem == window.history.state.ITNOREF?.trim()) {
               this.formMITLAD.patchValue({
                  [`LMCD_${lang}_ITDS`]: item?.ITDS || "",
                  [`LMCD_${lang}_FUDS`]: item?.FUDS || "",
               });
            }
         }

      }

      const itemBasic = (respItemBasic.length > 0 && !respItemBasic[0].error) ? respItemBasic[0] : {};
      const itemBasicDIGI_ACRF = (respMM200DIGI_ACRF.length > 0) ? respMM200DIGI_ACRF[0] : {};
      this.respItemBasicSelectedItem = itemBasic;

      const itemCugex = (respCugex.length > 0 && !respCugex[0].error) ? respCugex[0] : {};
      const itemFACI = (respFACI.length > 0 && !respFACI[0].error) ? respFACI[0] : {}
      this.respItemFaci = itemFACI;

      // Patching for value
      this.setMitmasValue_N_Mitfac_N_cugex(
         window.history.state.ITNOREF || "",
         itemBasic.ITDS || "",
         itemBasic.FUDS || "",
         itemBasic.PRGP || "",
         itemBasic.ITGR || "",
         itemBasic.GRWE || "",
         itemBasic.CFI3 || "",
         itemBasicDIGI_ACRF?.REPL?.split(";")[0] || "",
         itemBasic.ITTY || "",
         (itemBasic.VTCP ?? 0).toString().padStart(2, "0"),
         itemCugex.N096 || "",
         itemCugex.N296 || "",
         this.pageTitle === "KIT" ? (itemFACI.ORCO || "") : "",
         this.pageTitle === "KIT" ? (itemFACI.CSNO || "") : "",
         this.pageTitle === "KIT"
            ? (itemFACI.ACRF || "")
            : (itemBasicDIGI_ACRF?.REPL?.split(";")[1] || "")
      );


      this.updateLookupDataset();
      this.disabledFieldsMMS030();
      document.getElementById('MMITNO')?.focus();
   }


   onTab() {
      let lastFocused: HTMLElement | null = null;

      const formIds = ['formMITMAS', 'formCUGEX', 'formMITFAC', 'formMITPOP', 'formMITLAD'];
      const selector = formIds.map(id =>
         `form#${id} input[type="text"],
         form#${id} input[type="number"],
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

      const setDeaultSTAT = $('#MMSTAT').data('dropdown');
      setDeaultSTAT?.setCode('10');

      $('#MMSTAT').on('change.test', (e) => {
         const newVal = $(e.target).find(':checked').val();
         this.formMITMAS.patchValue({
            MMSTAT: newVal.toString()
         });
      });

   }
   setMitmasValue_N_Mitfac_N_cugex(itno: string, itds: string, fuds: string, prgp: string, itgr: string, grwe: string, cfi3: string, digi: string, itty: string, vtcp: string, n096: string, n296: string, m9orco: string, m9csno: string, m9acrf: string) {
      this.formMITMAS.patchValue({
         MMITNO: itno,
         MMITDS: itds,
         MMFUDS: fuds,
         MMPRGP: prgp,
         MMITGR: itgr,
         MMGRWE: grwe,
         MMDIGI: digi,
         MMCFI3: cfi3,
         M9ORCO: m9orco,
         M9CSNO: m9csno
      });

      this.formMITFAC.patchValue({
         MMVTCP: vtcp,
         MMITTY: itty,
         M9ACRF: m9acrf,
      });
      this.formCUGEX.patchValue({
         DELPIC: n096,
         DELGAM: n296
      });
   }


   initializeLookups() {
      const columnNamesMitmas = this.lang.get('MITMAS_FIELD_LABELS');
      const columnNamesMitfac = this.lang.get('MITFAC_FIELD_LABELS');
      const TX15 = this.lang.get('TX15');
      const TX40 = this.lang.get('TX40');

      const fields = [
         { key: 'ITGR', inputId: 'MMITGR', colId: 'ITGR', labelSet: columnNamesMitmas },
         { key: 'PRGP', inputId: 'MMPRGP', colId: 'PRGP', labelSet: columnNamesMitmas },
         { key: 'VTCD', inputId: 'MMVTCP', colId: 'VTCD', labelSet: columnNamesMitmas },
         { key: 'CSNO', inputId: 'M9CSNO', colId: 'CSNO', labelSet: columnNamesMitfac },
         { key: 'M9ORCO', inputId: 'M9ORCO', colId: 'CSCD', labelSet: columnNamesMitfac },
         { key: 'ITTY', inputId: 'MMITTY', colId: 'ITTY', labelSet: columnNamesMitmas },
         { key: 'M9ACRF', inputId: 'M9ACRF', colId: 'ACRF', labelSet: columnNamesMitfac },
         { key: 'DIGI', inputId: 'MMDIGI', colId: 'DIGI', labelSet: columnNamesMitmas },
         { key: 'CFI3', inputId: 'MMCFI3', colId: 'CFI3', labelSet: columnNamesMitmas },
      ];

      fields.forEach(field => {
         const columns = [
            { id: field.colId, name: field.labelSet[field.inputId], field: field.colId, formatter: Soho.Formatters.Text, filterType: 'text' },
            { id: 'TX15', name: TX15, field: 'TX15', formatter: Soho.Formatters.Text, filterType: 'text' },
            { id: 'TX40', name: TX40, field: 'TX40', formatter: Soho.Formatters.Text, filterType: 'text' }
         ];
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

         const MITMAS_FIELDS = ['MMITGR', 'MMPRGP', 'M9CSNO', 'M9ORCO', 'MMDIGI', 'MMCFI3'];
         const MITFAC_FIELDS = ['MMVTCP', 'MMITTY', 'M9ACRF'];

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

         }

         $(`#${field.inputId}`).on('change', (e, args) => {
            if (args && args[0] && args[0].data) {
               let formGroup;

               if (MITMAS_FIELDS.includes(field.inputId)) {
                  formGroup = this.formMITMAS;
               } else if (MITFAC_FIELDS.includes(field.inputId)) {
                  formGroup = this.formMITFAC;
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
         this.respCFI3
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
      this.setLabelforSelectedValue();
      this.isBusyForm = false;

   }


   async onsubmit() {
      this.resetProgressBar();
      if (this.pageTitle !== "KIT") {
         this.isBusyForm = true;
         const itemBasic = await this.validateFields();
         this.validateStepFG = true;//Progess Bar FG
         if (!itemBasic.valid) {
            this.isBusyForm = false;
            this.validateFieldsFG = "#icon-rejected-solid";//Progess Bar FG
            return;
         } else {
            this.validateFieldsFG = "#icon-success";//Progess Bar FG
         }
         const values = {
            MMITNO: (this.formMITMAS.value.MMITNO ?? '').toString().trim()?.toUpperCase(),
            MMSTAT: (this.formMITMAS.value.MMSTAT ?? '').toString().trim(),
            MMITDS: (this.formMITMAS.value.MMITDS ?? '').toString().trim(),
            MMFUDS: (() => {
               const itds = (this.formMITMAS.value.MMITDS ?? '').toString().trim();
               const fuds = (this.formMITMAS.value.MMFUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            MMPRGP: (this.formMITMAS.value.MMPRGP ?? '').toString().trim(),
            MMGRWE: (this.formMITMAS.value.MMGRWE ?? '').toString().trim(),
            MMCFI3: (this.formMITMAS.value.MMCFI3 ?? '').toString().trim(),
            MMDIGI: (this.formMITMAS.value.MMDIGI ?? '').toString().trim(),
            MMITTY: (this.formMITFAC.value.MMITTY ?? '').toString().trim(),
            MMVTCP: (this.formMITFAC.value.MMVTCP ?? '').toString().trim(),
            MMITGR: (this.formMITMAS.value.MMITGR ?? '').toString().trim(),
            DELPIC: (this.formCUGEX.value.DELPIC ?? '').toString().trim(),
            DELGAM: (this.formCUGEX.value.DELGAM ?? '').toString().trim(),
            M9ACRF: (this.formMITFAC.value.M9ACRF ?? '').toString().trim(),

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

            POP1: (this.formMITPOP.value.POP1 ?? '').toString().trim(),
            POP2: (this.formMITPOP.value.POP2 ?? '').toString().trim(),
         };


         const item = this.respItemBasicSelectedItem as any;
         const refItem = "T100200000";
         const cpyItem = window.history.state.ITNOREF || "";
         const newItem = values?.MMITNO;

         // build base input object with fallbacks(FG)
         const input = {
            refItem: refItem,
            cpyItem: cpyItem,
            newItem: newItem,
            stat: values?.MMSTAT || "99",
            itds: values?.MMITDS || "",
            fuds: values?.MMFUDS || "",
            resp: item?.RESP,
            dccd: item?.DCCD || "0",
            unms: item?.UNMS || "",
            itty: values?.MMITTY || item?.ITTY || "",
            chcd: item?.CHCD || "",
            stcd: item?.STCD || "",
            grwe: values?.MMGRWE || item?.GRWE || "",
            wapc: item?.WAPC || "",
            cfi3: values?.MMCFI3 || item?.CFI3 || "",
            txid: item?.TXID || "",
            dtid: item?.DTID || "",
            prgp: values?.MMPRGP || item?.PRGP || "",
            acrf: values?.M9ACRF || "",
            sale: item?.SALE || "",
            atmo: item?.ATMO || "",
            atmn: item?.ATMN || "",
            digi: values?.MMDIGI || item?.DIGI || "",
            itgr: values?.MMITGR || "",
            newe: values?.MMGRWE || item?.GRWE || "",
            ppun: item?.UNMS || "",
            hie1: values?.MMITGR ? values?.MMITGR.charAt(0) : "", // first char
            hie2: values?.MMITGR ? values?.MMITGR?.substring(0, 4) : "", // first 4 chars
            hie3: values?.MMITGR || "",
            aluc: "",//item?.UNMS || "",
            tpli: cpyItem,
            stun: item?.UNMS || "",
            spun: item?.UNMS || "",
            alun: item?.UNMS || "",
            vtcp: values?.MMITTY === "J00" ? "00" : values?.MMVTCP ?? "00",
            vtcs: item?.SALE === "1" ? "1" : "",
            chid: this.shared.userContext.USID,
            cpun: item?.UNMS || "",
            delpic: values?.DELPIC !== "" ? values?.DELPIC : "0",
            delgam: "0",
            delchef: values?.DELGAM !== "" ? values?.DELGAM : "0",
            indi: "0",
            bacd: "0",
            tpcd: "0"
         };

         // fetch TPCD
         const respTPCD = await this.shared.call_CRS040_GetTPCDFromITTY(input.itty);
         if (respTPCD.length > 0) {
            input.tpcd = respTPCD[0]?.REPL;
         }

         // final call
         const respCPY = await this.shared.call_MMS200_CpyItmBasic(input);
         this.copyItemBasicStepFG = true;//Progess Bar FG
         if (respCPY.length > 0 && !respCPY[0].error) {
            this.shared.call_MMS200_UpdItmBasic(values.MMITNO, input.acrf); //update ACRF using this API since does not exist on prem
            this.copyItemBasicFG = "#icon-success";//Progess Bar FG
            this.shared.displaySuccessMessage(`${this.lang.get('ERROR_TYPE')['SUCCESS']}`, `${input.newItem} ${this.lang.get('ERROR_TYPE')['CREATED_WITH_SUCCESS']}`);
            const [respUpdPrice, respAddCUGEX, respUpdCUGEX] = await Promise.all([
               this.shared.call_MMS200_UpdItmPrice(values.MMITNO, values.MMDIGI),
               this.shared.call_CUSEXT_AddFieldValue("MITMAS", input.newItem, input.delpic?.toString(), input.delgam?.toString(), input.delchef?.toString(), ""),
               this.shared.call_CUSEXT_ChgieldValue("MITMAS", input.newItem, input.delpic?.toString(), input.delgam?.toString(), input.delchef?.toString(), "")
            ]);
            this.iconUpdatePriceFG = "#icon-success";//Progess Bar FG
            this.updateItemBasicStepFG = true;//Progess Bar FG



            this.languageFG = true;//Progess Bar FG
            const countries = ['GB', 'DE', 'PL', 'NL', 'PT', 'ES', 'FR'];

            const promises = countries
               .filter(code => values[`LMCD_${code}_ITDS`]?.trim() !== '')
               .map(code => {
                  const itds = values[`LMCD_${code}_ITDS`];
                  const fud = values[`LMCD_${code}_FUDS`];
                  return this.shared.call_MMS030_Add(input.newItem, code, itds, fud);
               });

            await Promise.all(promises);
            this.iconLanguageFG = "#icon-success";//Progess Bar FG

            // Create Item Alias
            this.aliasFG = true;//Progess Bar FG
            this.iconAliasFG = "#icon-success";//Progess Bar FG

            const aliases = [
               { type: '1', value: values.POP1, qualifier: '' },
               { type: '2', value: values.POP2, qualifier: 'EA13 ' }
            ];

            const popPromises = aliases
               .filter(alias => alias.value !== '')
               .map(alias => this.shared.call_MMS025_AddAlias(alias.type, values.MMITNO, alias.value, alias.qualifier));

            const respAlias = await Promise.all(popPromises);

            if (respAlias.some(result => result[0]?.error)) {
               this.iconAliasFG = "#icon-rejected-solid";//Progess Bar FG
            }
            //Add CUGEX MITPOP
            const popCUGEXPromisesAdd = aliases
               .filter(alias => alias.value !== '')
               .map(alias => this.shared.call_CUSEXT_AddFieldValue("MITPOP", values.MMITNO, alias.type, alias.qualifier, alias.value, this.shared.userContext.currentDivision));

            await Promise.all(popCUGEXPromisesAdd);

            const popCUGEXPromisesChg = aliases
               .filter(alias => alias.value !== '')
               .map(alias => this.shared.call_CUSEXT_ChgieldValue("MITPOP", values.MMITNO, alias.type, alias.qualifier, alias.value, this.shared.userContext.currentDivision));

            await Promise.all(popCUGEXPromisesChg);
            //End Add CUGEX MITPOP

         }
         else {
            this.copyItemBasicFG = "#icon-rejected-solid";//Progess Bar FG
            this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, respCPY[0].errorMessage.errorMessage);
            this.isBusyForm = false;
            return
         }
         this.isBusyForm = false;
      }
      else {
         this.isBusyForm = true;
         const itemBasic = await this.validateFields();
         this.validateFieldsKIT = true; //Progess Bar KIT
         if (!itemBasic.valid) {
            this.isBusyForm = false;
            this.iconValidateFieldsKIT = "#icon-rejected-solid"; //Progess Bar KIT
            return;
         }
         else {
            this.iconValidateFieldsKIT = "#icon-success"; //Progess Bar KIT
         }
         const values = {
            MMITNO: (this.formMITMAS.value.MMITNO ?? '').toString().trim()?.toUpperCase(),
            MMSTAT: (this.formMITMAS.value.MMSTAT ?? '').toString().trim(),
            MMITDS: (this.formMITMAS.value.MMITDS ?? '').toString().trim(),
            MMFUDS: (() => {
               const itds = (this.formMITMAS.value.MMITDS ?? '').toString().trim();
               const fuds = (this.formMITMAS.value.MMFUDS ?? '').toString().trim();
               return !fuds && itds ? itds : fuds;
            })(),
            MMPRGP: (this.formMITMAS.value.MMPRGP ?? '').toString().trim(),
            MMGRWE: (this.formMITMAS.value.MMGRWE ?? '').toString().trim(),
            MMCFI3: (this.formMITMAS.value.MMCFI3 ?? '').toString().trim(),
            MMDIGI: (this.formMITMAS.value.MMDIGI ?? '').toString().trim(),
            MMITTY: (this.formMITFAC.value.MMITTY ?? '').toString().trim(),
            MMVTCP: (this.formMITFAC.value.MMVTCP ?? '').toString().trim(),
            MMITGR: (this.formMITMAS.value.MMITGR ?? '').toString().trim(),
            DELPIC: (this.formCUGEX.value.DELPIC ?? '').toString().trim(),
            DELGAM: (this.formCUGEX.value.DELGAM ?? '').toString().trim(),

            M9ORCO: (this.formMITMAS.value.M9ORCO ?? '').toString().trim(),
            M9CSNO: (this.formMITMAS.value.M9CSNO ?? '').toString().trim(),
            M9ACRF: (this.formMITFAC.value.M9ACRF ?? '').toString().trim(),

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

            POP1: (this.formMITPOP.value.POP1 ?? '').toString().trim(),
            POP2: (this.formMITPOP.value.POP2 ?? '').toString().trim(),
         };

         this.copyItemBasicKIT = true;
         const item = this.respItemBasicSelectedItem as any;
         const itemFaci = this.respItemFaci as any;
         const refItem = "T100100000";
         const cpyItem = window.history.state.ITNOREF || "";
         const newItem = values?.MMITNO;
         const cpyfaci = window.history.state.FACI || "";

         // build base input object with fallbacks (KIT)
         const input = {
            refItem: refItem,
            cpyItem: cpyItem,
            newItem: newItem,
            stat: values?.MMSTAT || "99",
            itds: values?.MMITDS || "",
            fuds: values?.MMFUDS || "",
            resp: item?.RESP,
            dccd: item?.DCCD || "0",
            unms: item?.UNMS || "",
            itty: values?.MMITTY || item?.ITTY || "",
            chcd: item?.CHCD || "",
            stcd: item?.STCD || "",
            grwe: values?.MMGRWE || item?.GRWE || "",
            wapc: item?.WAPC || "",
            cfi3: values?.MMCFI3 || item?.CFI3 || "",
            txid: item?.TXID || "",
            dtid: item?.DTID || "",
            prgp: values?.MMPRGP || item?.PRGP || "",
            acrf: "YYYYYYYY" || "",
            sale: item?.SALE || "",
            atmo: item?.ATMO || "",
            atmn: item?.ATMN || "",
            digi: values?.MMDIGI || item?.DIGI || "",
            itgr: values?.MMITGR || "",
            newe: values?.MMGRWE || item?.GRWE || "",
            ppun: item?.UNMS || "",
            hie1: values?.MMITGR ? values?.MMITGR.charAt(0) : "", // first char
            hie2: values?.MMITGR ? values?.MMITGR?.substring(0, 4) : "", // first 4 chars
            hie3: values?.MMITGR || "",
            aluc: "",//item?.UNMS || "",
            tpli: cpyItem,
            stun: item?.UNMS || "",
            spun: item?.UNMS || "",
            alun: item?.UNMS || "",
            vtcp: values?.MMITTY === "J00" ? "?" : values?.MMVTCP ?? "",
            vtcs: item?.SALE === "1" ? "1" : "",
            chid: this.shared.userContext.USID,
            cpun: item?.UNMS || "",
            delpic: values?.DELPIC !== "" ? values?.DELPIC : "0",
            delgam: "0",
            delchef: values?.DELGAM !== "" ? values?.DELGAM : "0",
            indi: "0",
            bacd: "0",
            tpcd: "0"
         };

         const inputFaci = {
            refItem: refItem,
            cpyItem: cpyItem,
            newItem: newItem,
            cpyfaci: cpyfaci,
            csno: values?.M9CSNO || itemFaci?.CSNO || "",
            orco: values?.M9ORCO || itemFaci?.ORCO || "",
            wcln: itemFaci?.WCLN || "",
            acrf: values?.M9ACRF || itemFaci?.ACRF || "",
         }


         // fetch TPCD
         const respTPCD = await this.shared.call_CRS040_GetTPCDFromITTY(input.itty);
         if (respTPCD.length > 0) {
            input.tpcd = respTPCD[0]?.REPL;
         }

         const respCPY = await this.shared.call_MMS200_CpyItmBasic(input)
         if (respCPY.length > 0 && !respCPY[0].error) {
            this.shared.call_MMS200_UpdItmBasic(values.MMITNO, input.acrf); //update ACRF using this API since does not exist on prem
            this.iconCopyItemBasicKIT = "#icon-success"; //Progess Bar KIT
            this.shared.displaySuccessMessage(`${this.lang.get('ERROR_TYPE')['SUCCESS']}`, `${values.MMITNO} ${this.lang.get('ERROR_TYPE')['CREATED_WITH_SUCCESS']}`);
            this.copyItemFacilityKIT = true;  //Progess Bar KIT
            this.updateItemPriceKIT = true;   //Progess Bar KIT
            this.cugex1KIT = true;            //Progess Bar KIT
            const [respCPYFACI, respUpdPrice, respAddCUGEX1, respUpdGUEX] = await Promise.all([
               this.shared.call_MMS200_CpyItmFac(inputFaci),
               this.shared.call_MMS200_UpdItmPrice(values.MMITNO, values.MMDIGI),
               this.shared.call_CUSEXT_AddFieldValue("MITMAS", values.MMITNO, input.delpic?.toString(), input.delgam?.toString(), input.delchef?.toString(), ""),
               this.shared.call_CUSEXT_ChgieldValue("MITMAS", values.MMITNO, input.delpic?.toString(), input.delgam?.toString(), input.delchef?.toString(), "")
            ]);

            if (respCPYFACI.length > 0 && !respCPYFACI[0].error) {
               this.iconCopyItemFacilityKIT = "#icon-success";//Progess Bar KIT
            } else {
               this.iconCopyItemFacilityKIT = "#icon-rejected-solid";//Progess Bar KIT
            }

            if (respUpdPrice.length > 0 && !respUpdPrice[0].error) {
               this.iconUpdateItemPriceKIT = "#icon-success";//Progess Bar KIT
            } else {
               this.iconUpdateItemPriceKIT = "#icon-rejected-solid";//Progess Bar KIT
            }
            this.iconCUGEX1KIT = "#icon-success";//Progess Bar KIT



            this.languageKIT = true;//Progess Bar KIT
            const countries = ['GB', 'DE', 'PL', 'NL', 'PT', 'ES', 'FR'];

            const promises = countries
               .filter(code => values[`LMCD_${code}_ITDS`]?.trim() !== '')
               .map(code => {
                  const itds = values[`LMCD_${code}_ITDS`];
                  const fud = values[`LMCD_${code}_FUDS`];
                  return this.shared.call_MMS030_Add(values.MMITNO, code, itds, fud);
               });

            await Promise.all(promises);
            this.iconLanguageKIT = "#icon-success";//Progess Bar KIT

            // Create Item Alias
            this.aliasKIT = true;//Progess Bar KIT
            this.iconAliasKIT = "#icon-success";//Progess Bar KIT

            const aliases = [
               { type: '1', value: values.POP1, qualifier: '' },
               { type: '2', value: values.POP2, qualifier: 'EA13 ' }
            ];

            const popPromises = aliases
               .filter(alias => alias.value !== '')
               .map(alias => this.shared.call_MMS025_AddAlias(alias.type, values.MMITNO, alias.value, alias.qualifier));

            const respAlias = await Promise.all(popPromises);

            if (respAlias.some(result => result[0]?.error)) {
               this.iconAliasKIT = "#icon-rejected-solid";//Progess Bar KIT
            }
            //Add CUGEX MITPOP
            const popCUGEXPromisesAdd = aliases
               .filter(alias => alias.value !== '')
               .map(alias => this.shared.call_CUSEXT_AddFieldValue("MITPOP", values.MMITNO, alias.type, alias.qualifier, alias.value, this.shared.userContext.currentDivision));

            await Promise.all(popCUGEXPromisesAdd);

            const popCUGEXPromisesChg = aliases
               .filter(alias => alias.value !== '')
               .map(alias => this.shared.call_CUSEXT_ChgieldValue("MITPOP", values.MMITNO, alias.type, alias.qualifier, alias.value, this.shared.userContext.currentDivision));

            await Promise.all(popCUGEXPromisesChg);
            //End Add CUGEX MITPOP



            let errorMessages: string[] = [];

            if (respUpdPrice?.[0]?.error) {
               errorMessages.push(`PRIX: ${respUpdPrice[0].errorMessage.errorMessage}`);
            }

            if (respCPYFACI?.[0]?.error) {
               errorMessages.push(`FACI: ${respCPYFACI[0].errorMessage.errorMessage}`);
            }

            if (errorMessages.length > 0) {
               this.shared.displayToast(`${this.lang.get('ERROR_TYPE')['ERROR']}`, errorMessages.join('\n'));
               this.isBusyForm = false;
               return;
            }
         }
         else {
            this.iconCopyItemBasicKIT = "#icon-rejected-solid"; //Progess Bar KIT
            this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, respCPY[0].errorMessage.errorMessage);
            this.isBusyForm = false;
            return
         }
         this.isBusyForm = false;
      }
   }

   async validateFields(): Promise<{ valid: boolean; itemBasic: any }> {
      const values = {
         MMITNO: (this.formMITMAS.value.MMITNO ?? '').toString().trim()?.toUpperCase(),
         MMPRGP: (this.formMITMAS.value.MMPRGP ?? '').toString().trim(),
         MMITGR: (this.formMITMAS.value.MMITGR ?? '').toString().trim(),
         M9CSNO: (this.formMITMAS.value.M9CSNO ?? '').toString().trim(),
         M9ORCO: (this.formMITMAS.value.M9ORCO ?? '').toString().trim(),
         M9ACRF: (this.formMITFAC.value.M9ACRF ?? '').toString().trim(),
         MMITTY: (this.formMITFAC.value.MMITTY ?? '').toString().trim(),
         MMVTCP: (this.formMITFAC.value.MMVTCP ?? '').toString().trim(),
         MMDIGI: (this.formMITMAS.value.MMDIGI ?? '').toString().trim(),
         MMCFI3: (this.formMITMAS.value.MMCFI3 ?? '').toString().trim(),
         POP1: (this.formMITPOP.value.POP1 ?? '').toString().trim(),
         POP2: (this.formMITPOP.value.POP2 ?? '').toString().trim(),

      };

      const validations = [
         { key: 'MMPRGP', list: this.respPRGP, field: 'PRGP', label: this.lang.get('MITMAS_FIELD_LABELS')['MMPRGP'] },
         { key: 'MMITGR', list: this.respITGR, field: 'ITGR', label: this.lang.get('MITMAS_FIELD_LABELS')['MMITGR'] },
         { key: 'M9CSNO', list: this.respCSNO, field: 'CSNO', label: this.lang.get('MITFAC_FIELD_LABELS')['M9CSNO'] },
         { key: 'M9ORCO', list: this.respORCO, field: 'CSCD', label: this.lang.get('MITFAC_FIELD_LABELS')['M9ORCO'] },
         { key: 'M9ACRF', list: this.respACRF, field: 'ACRF', label: this.lang.get('MITFAC_FIELD_LABELS')['M9ACRF'] },
         { key: 'MMITTY', list: this.respITTY, field: 'ITTY', label: this.lang.get('MITMAS_FIELD_LABELS')['MMITTY'] },
         { key: 'MMVTCP', list: this.respVTCP, field: 'VTCD', label: this.lang.get('MITMAS_FIELD_LABELS')['MMVTCP'] },
         { key: 'MMDIGI', list: this.respDIGI, field: 'DIGI', label: this.lang.get('MITMAS_FIELD_LABELS')['MMDIGI'] },
         { key: 'MMCFI3', list: this.respCFI3, field: 'CFI3', label: this.lang.get('MITMAS_FIELD_LABELS')['MMCFI3'] },
      ];

      if (!values.MMITNO) {
         this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, `${this.lang.get('MITMAS_FIELD_LABELS')['MMITNO']} ${this.lang.get('ERROR_TYPE')['MANDATORY_FIELD']}`);
         document.getElementById('MMITNO')?.focus();
         return { valid: false, itemBasic: {} };
      }

      const respCheckItem = await this.shared.call_MMS200_GetItem(values.MMITNO);
      if (respCheckItem.length > 0 && !respCheckItem[0].error) {
         this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, `${values.MMITNO} ${this.lang.get('ERROR_TYPE')['ALREADY_EXIST']}`);
         document.getElementById('MMITNO')?.focus();
         return { valid: false, itemBasic: {} };
      }

      for (const { key, list, field, label } of validations) {
         let value = values[key];

         if (value) {
            if (key == "MMVTCP") {
               value = value.padStart(2, '0');
            }
            const isValid = list.some(item => item?.[field] === value);
            if (!isValid) {
               this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, `${label} ${value} ${this.lang.get('ERROR_TYPE')['NOT_VALID']}`);
               document.getElementById(key)?.focus();
               return { valid: false, itemBasic: {} };
            }
         }
      }
      if (values?.POP2?.trim() != "") {
         if (values.POP2?.trim()?.length !== 13) {
            this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, `${this.lang.get('ERROR_TYPE')['NO_CHARS_EAN13']}`);
            document.getElementById('POP2')?.focus();
            return { valid: false, itemBasic: {} };
         } else {
            const ean = values.POP2.trim();
            // Split the string into digits
            const digits = ean.split('').map(d => parseInt(d, 10));
            // Sum of digits in odd positions (1,3,5,7,9,11) - note index 0 based
            const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8] + digits[10];
            // Sum of digits in even positions (2,4,6,8,10,12)
            const sumEven = digits[1] + digits[3] + digits[5] + digits[7] + digits[9] + digits[11];
            // Compute B
            const B = sumEven * 3 + sumOdd;
            // Compute A: round B up to nearest multiple of 10
            const A = Math.ceil(B / 10) * 10;
            // Compute check digit
            const checkDigit = A - B;
            if (checkDigit !== digits[12]) {
               this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, `${this.lang.get('ERROR_TYPE')['ERROR_EAN13']}`);
               document.getElementById('POP2')?.focus();
               return { valid: false, itemBasic: {} };
            }
            const respEA13 = await this.shared.call_MMS025_CheckIfExistEA13(`MPPOPN from MITPOP where MPCONO = ${this.shared.userContext.currentCompany} and MPALWT = 2 and MPALWQ = EA13 and MPPOPN = ${ean}`)
            if (respEA13.length > 0) {
               this.shared.displayErrorMessage(`${this.lang.get('ERROR_TYPE')['ERROR']}`, `EAN13 ${ean} ${this.lang.get('ERROR_TYPE')['ALREADY_EXIST']}`);
               document.getElementById('POP2')?.focus();
               return { valid: false, itemBasic: {} };
            }
         }
      }
      return { valid: true, itemBasic: respCheckItem[0] };
   }



   resetProgressBar() {
      //FG
      this.validateStepFG = false;
      this.copyItemBasicStepFG = false;
      this.updateItemBasicStepFG = false;
      this.iconUpdatePriceFG = "";
      this.copyItemBasicFG = "";
      this.validateFieldsFG = "";

      //KIT
      this.validateFieldsKIT = false;
      this.copyItemBasicKIT = false;
      this.copyItemFacilityKIT = false;
      this.updateItemPriceKIT = false;
      this.cugex1KIT = false;
      this.languageKIT = false;
      this.aliasKIT = false;
      this.iconValidateFieldsKIT = "";
      this.iconCopyItemBasicKIT = "";
      this.iconCopyItemFacilityKIT = "";
      this.iconUpdateItemPriceKIT = "";
      this.iconCUGEX1KIT = "";
      this.iconLanguageKIT = "";
      this.iconAliasKIT = "";
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

   setupCustomTabNavigation() {
      if (this.pageTitle === "KIT") {
         const navigationMap: { [key: string]: string } = {
            'MMPRGP': 'MMITGR',
            'MMITGR': 'M9CSNO',
            'M9CSNO': 'M9ORCO',
            'M9ORCO': 'MMGRWE',
            'MMGRWE': 'MMCFI3',
            'MMCFI3': 'MMDIGI',
            'M9ACRF': 'MMITTY',
            'MMITTY': 'MMVTCP',
            'MMVTCP': 'DELPIC',
            'MMDIGI': 'LMCD_GB_ITDS',
            'DELGAM': 'MMITNO'
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
      else {
         const navigationMap: { [key: string]: string } = {
            'MMPRGP': 'MMITGR',
            'MMITGR': 'MMGRWE',
            'MMGRWE': 'MMCFI3',
            'MMCFI3': 'MMDIGI',
            'MMDIGI': 'LMCD_GB_ITDS',
            'M9ACRF': 'MMITTY',
            'MMITTY': 'MMVTCP',
            'MMVTCP': 'MMITNO',
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


   setLabelforSelectedValue() {
      const fields = [
         { key: 'ITGR', inputId: 'MMITGR', colId: 'ITGR', dataset: this.respITGR },
         { key: 'PRGP', inputId: 'MMPRGP', colId: 'PRGP', dataset: this.respPRGP },
         { key: 'CSNO', inputId: 'M9CSNO', colId: 'CSNO', dataset: this.respCSNO },
         { key: 'M9ORCO', inputId: 'M9ORCO', colId: 'CSCD', dataset: this.respORCO },
         { key: 'ITTY', inputId: 'MMITTY', colId: 'ITTY', dataset: this.respITTY },
         { key: 'M9ACRF', inputId: 'M9ACRF', colId: 'ACRF', dataset: this.respACRF },
         { key: 'VTCD', inputId: 'MMVTCP', colId: 'VTCD', dataset: this.respVTCP },
         { key: 'DIGI', inputId: 'MMDIGI', colId: 'DIGI', dataset: this.respDIGI },
         { key: 'CFI3', inputId: 'MMCFI3', colId: 'CFI3', dataset: this.respCFI3 }
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




}
