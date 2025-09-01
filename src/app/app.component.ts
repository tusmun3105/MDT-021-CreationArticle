import { Component, OnInit } from '@angular/core';
import { CoreBase, IUserContext } from '@infor-up/m3-odin';
import { MIService, UserService } from '@infor-up/m3-odin-angular';
import versionofAPP from '../assets/parametre.json';
import apiList from '../assets/api.json';
import { LanguageService } from './shared/language.service';
import { SharedService } from './shared/shared.service';


@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent extends CoreBase implements OnInit {

   private appendedapiList = apiList
      .map((item) => `${item.Program} / ${item.Transaction}`)
      .join('<br/>');
   appVersion: { version: string } = versionofAPP;


   constructor(private miService: MIService, private userService: UserService, public lang: LanguageService, private shared: SharedService) {
      super('AppComponent');
      this.lang.load(this.shared.userContext?.currentLanguage);
   }

   ngOnInit() {
   }

   headerPanelVersion() {
      //Show About Screen
      $('body')
         .about({
            appName: this.lang.get('appName'),
            productName: 'H5 SDK',
            version: this.appVersion.version,
            content:
               `<p>${this.lang.get('appContent')} :<br/><br/>` +
               this.appendedapiList +
               '<br/><br/></p>',
            attributes: [
               { name: 'id', value: 'about-modal' },
               { name: 'data-automation-id', value: 'about-modal-automation-id' },
            ],
         })
         .on('beforeopen.about', () => { })
         .on('close.about', () => { })
         .on('afterclose.about', () => { });
   }
}
