import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Log } from '@infor-up/m3-odin';
import { M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoComponentsModule } from 'ids-enterprise-ng'; // TODO Consider only importing individual SoHo modules in production
import { AppComponent } from './app.component';
import { SharedService } from './shared/shared.service';
import { HttpClientModule } from '@angular/common/http';
import { SelectionReferenceComponent } from './selection-reference/selection-reference.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InterfaceOFComponent } from './interface-of/interface-of.component';
import { InterfaceOAComponent } from './interface-oa/interface-oa.component';
import { InterfaceKITFGComponent } from './interface-kit-fg/interface-kit-fg.component';
import { AppRoutingModule } from './app-routing.module';

export function initializeApp(shared: SharedService, locale: string): Function {
   return () => {
      // First, set the locale for Soho
      Soho.Locale.culturesPath = 'assets/ids-enterprise/js/cultures/';
      return Soho.Locale.set(locale).then(() => {
         // Then, fetch data from the SharedService API
         return shared.getUserContext().then(data => {
            console.log("User Context information:", data)
         }).catch(error => {
            console.error('Error loading data during initialization:', error);
            throw new Error('Error loading data during initialization');
         });
      }).catch(err => {
         Log.error('Failed to set IDS locale', err);
         throw new Error('Locale setup failed');
      });
   };
}

@NgModule({
   declarations: [
      AppComponent,
      SelectionReferenceComponent,
      InterfaceOFComponent,
      InterfaceOAComponent,
      InterfaceKITFGComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      SohoComponentsModule,
      M3OdinModule,
      HttpClientModule,
      ReactiveFormsModule,
      AppRoutingModule
   ],
   providers: [
      {
         provide: LOCALE_ID,
         useValue: 'en-fr',
      },
      {
         provide: APP_INITIALIZER,
         multi: true,
         useFactory: initializeApp,
         deps: [SharedService, LOCALE_ID],
      },
      SharedService
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
