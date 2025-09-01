import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
   selector: 'app-interface-oa',
   templateUrl: './interface-oa.component.html',
   styleUrls: ['./interface-oa.component.css']
})
export class InterfaceOAComponent implements OnInit {

   constructor(private router: Router) {
      const nav = this.router.getCurrentNavigation();
      const state = nav?.extras.state;
      console.log(state)
      console.log(state?.WHLO, state?.ITNOREF);
   }

   ngOnInit(): void {
   }

}
