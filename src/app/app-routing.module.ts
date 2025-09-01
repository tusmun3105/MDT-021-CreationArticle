import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { InterfaceOFComponent } from './interface-of/interface-of.component';
import { InterfaceOAComponent } from './interface-oa/interface-oa.component';
import { InterfaceKITFGComponent } from './interface-kit-fg/interface-kit-fg.component';
import { SelectionReferenceComponent } from './selection-reference/selection-reference.component';

const routes: Routes = [
   { path: 'component-OF', component: InterfaceOFComponent },
   { path: 'component-OA', component: InterfaceOAComponent },
   { path: 'component-KIT_FG', component: InterfaceKITFGComponent },
   { path: 'component-SELECTIONREF', component: SelectionReferenceComponent },
   { path: '', redirectTo: 'component-SELECTIONREF', pathMatch: 'full' }, // default route
];

@NgModule({
   declarations: [],
   imports: [
      CommonModule,
      RouterModule.forRoot(routes)
   ],
   exports: [
      RouterModule
   ]
})
export class AppRoutingModule { }
