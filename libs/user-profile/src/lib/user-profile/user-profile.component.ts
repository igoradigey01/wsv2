import { Component, Output, EventEmitter,Input, ChangeDetectionStrategy,} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

import {StateView} from '@wsv2/app-common'



import { Router } from '@angular/router';
import { UserProfileDto } from '../_shared/interfaces/user-profileDto.model';


const THUMBUP_ICON = `
 <?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN' 
  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
  <svg  enable-background="new 0 0 512 512" height="512px" id="Delivery_x5F_service" version="1.1" viewBox="0 0 512 512" width="512px"
   xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 <g><g><g>
 <path fill="currentColor" d="M248.066,121.006c0-14.837-12.071-26.909-26.909-26.909c-14.833,0-26.9,12.071-26.9,26.909s12.067,26.909,26.9,26.909     C235.995,147.915,248.066,135.844,248.066,121.006z M204.258,121.006c0-9.323,7.581-16.909,16.9-16.909     c9.323,0,16.909,7.585,16.909,16.909s-7.585,16.909-16.909,16.909C211.839,137.915,204.258,130.33,204.258,121.006z" />
 <path fill="currentColor" d="M224.901,198.757c4.625-5.225,45.194-51.777,45.194-77.198c0-26.979-21.954-48.929-48.938-48.929     c-26.979,0-48.929,21.949-48.929,48.929c0,25.42,40.56,71.973,45.185,77.197l3.743,4.229L224.901,198.757z M182.229,121.56     c0-21.465,17.463-38.929,38.929-38.929c21.47,0,38.938,17.463,38.938,38.929c0,16.635-25.371,50.145-38.938,66.228     C207.593,171.708,182.229,138.207,182.229,121.56z"/></g><g><rect height="10" width="48.194" x="45.697" y="354.72"/><rect height="10" width="15.754" x="18.292" y="354.72"/><rect height="10" width="29.088" x="64.802" y="382.037"/></g><g><rect height="10" width="25.623" x="167.354" y="280.128"/>
 <path  fill="currentColor" d="M42.816,178.75v95.207H53.77h28.329l52.807,39.729c-0.158,1.389-0.288,2.797-0.382,4.226     c-15.082,13.107-24.412,31.097-24.412,50.925v20.981h18.149c1.49,16.317,10.193,30.571,22.887,39.552H81.103v10h186v-10h-53.118     c6.343-4.487,11.688-10.288,15.638-17.01h33.589l16.022-8.269c4.417,2.403,9.476,3.77,14.846,3.77h72.388l2.363-0.003l1.5-1.822     c0.086-0.105,1.77-2.115,4.883-5.316c3.948,11.917,11.916,21.965,22.186,28.65h-84.297v10h180.605v-10h-36.953     c14.928-9.742,24.822-26.58,24.822-45.695c0-12.11-4.076-23.822-11.379-33.311c5.221-0.669,10.592-1.037,16.104-1.037     c4.191,0,5.579-2.857,5.904-3.733c1.668-4.487-2.292-7.902-8.286-13.071c-1.349-1.164-2.624-2.262-3.362-3.004     c-12.035-12.045-27.188-19.814-43.627-22.601l-40.978-100.418h12.352v-4.688h1.026c8.797,0,15.953-7.156,15.953-15.952v-0.343     c0-8.796-7.156-15.953-15.953-15.953h-1.026v-4.688h-34.588c-11.487,0-20.833,9.346-20.833,20.833v9.68     c0,0.375,0.02,0.744,0.056,1.109h-6.093l-21.27-21.271h-24.982v10h20.84l21.27,21.271h20.063l-11.099,33.635l14.987,88.778     c-7.368,7.195-13.392,15.79-17.617,25.385h-56.765c-2.693-5.52-4.873-11.268-6.516-17.217c-7.377-26.731-1.742-50.34,3.053-63.5     c5.217-1.314,9.094-6.032,9.094-11.65c0-16.375-13.322-29.697-29.697-29.697H165.28c-11.503,0-20.862,9.358-20.862,20.862     c0,3.981,1.141,7.693,3.085,10.862h-9.48V178.75H42.816z M52.816,263.957V188.75h75.207v75.207H53.77H52.816z M120.112,368.836     c0-34.482,33.443-62.537,74.55-62.537h18.891c27.199,0,49.327,18.448,49.327,41.124v24.19v5v3.204h-25.99     c-2.532-27.745-25.925-49.552-54.315-49.552c-28.395,0-51.792,21.807-54.324,49.552h-8.138V368.836z M138.311,379.817     c2.494-22.22,21.389-39.552,44.263-39.552c22.87,0,41.761,17.332,44.254,39.552H138.311z M197.318,389.817     c-2.09,6.144-7.903,10.581-14.744,10.581c-6.845,0-12.661-4.438-14.752-10.581H197.318z M182.564,429.369     c-22.87,0-41.761-17.332-44.254-39.552h19.167c2.333,11.72,12.697,20.581,25.097,20.581c12.395,0,22.756-8.861,25.088-20.581     h19.166c-0.494,4.405-1.629,8.618-3.317,12.542h-17.723v10h11.755C209.378,422.707,196.738,429.369,182.564,429.369z      M260.785,402.359h-26.58c1.361-3.996,2.274-8.193,2.671-12.542h28.934c1.27,2.713,2.916,5.212,4.871,7.435L260.785,402.359z      M471.578,383.674c0,24.561-19.986,44.542-44.552,44.542c-21.044,0-39.33-15.04-43.602-35.391     c4.956-4.474,11.231-9.657,18.665-14.856c-0.42,1.836-0.648,3.742-0.648,5.703c0,14.107,11.477,25.585,25.585,25.585     s25.585-11.478,25.585-25.585c0-11.097-7.102-20.563-16.998-24.099c7.23-2.935,14.945-5.429,23.1-7.218     C466.916,360.68,471.578,371.955,471.578,383.674z M415.821,372.865l6.763,13.1l8.885-4.587l-6.762-13.1     c0.759-0.114,1.529-0.192,2.319-0.192c8.594,0,15.585,6.992,15.585,15.586s-6.991,15.585-15.585,15.585     s-15.585-6.991-15.585-15.585C411.441,379.476,413.115,375.67,415.821,372.865z M409.332,179.564c3.283,0,5.953,2.67,5.953,5.953     v0.343c0,3.282-2.67,5.952-5.953,5.952h-1.026v-12.248H409.332z M362.885,195.39v-9.68c0-5.974,4.859-10.833,10.833-10.833     h24.588v21.623h-24.688h-9.624C363.382,196.499,362.885,196.001,362.885,195.39z M361.943,240.914l11.354-34.41h11.858     l40.522,99.302c-0.812-0.023-1.621-0.06-2.437-0.06c-17.681,0-34.227,5.802-47.708,15.667L361.943,240.914z M423.241,315.746     c18.974,0,36.816,7.401,50.239,20.837c0.888,0.89,2.098,1.946,3.4,3.072c-34.131,2.378-62.188,17.219-80.281,29.837     c-17.199,11.995-28.455,23.9-32.42,28.368h-70.099c-9.956,0-18.329-6.912-20.596-16.2h37.539l-0.04-0.049l41.281-0.002     l0.584-4.331C357.586,342.199,387.848,315.746,423.241,315.746z M345.406,364.297c-0.694,2.393-1.287,4.83-1.762,7.313     l-40.646,0.002c-1.82-2.378-3.523-4.819-5.113-7.314H345.406z M290.709,371.612l-17.83,0.001v-24.19     c0-28.189-26.614-51.124-59.327-51.124h-18.891c-18.298,0-35.242,5.029-49.095,13.538c2.897-16.515,10.255-29.319,14.733-35.877     h117.805c-4.852,14.896-9.411,38.868-1.984,65.78C279.252,351.089,284.146,361.771,290.709,371.612z M165.28,242.233h102.929     c10.861,0,19.697,8.836,19.697,19.697c0,1.117-0.909,2.027-2.027,2.027H165.28c-5.989,0-10.862-4.873-10.862-10.862     S159.291,242.233,165.28,242.233z M148.474,273.957c-4.069,6.908-8.801,16.757-11.631,28.672l-38.11-28.672h39.29H148.474z"/><rect height="10" width="28.684" x="90.419" y="200.669"/><rect height="10" width="17.323" x="281.113" y="429.369"/>
 <rect height="10" width="15.833" x="53.77" y="429.369"/></g></g></g></svg>
`;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'wsv2-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {  

  _errorMgs: string[] = [];

  @Input() public User: UserProfileDto = <UserProfileDto>{
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
  };

  @Input()   public Massages = 0; // not reliz

  @Output()
     // eslint-disable-next-line @angular-eslint/no-output-on-prefix
     onToggleViewState:EventEmitter<StateView> = new EventEmitter()
  
  constructor(
   
    private router: Router,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    // Note that we provide the icon here as a string literal here due to a limitation in
    // Stackblitz. If you want to provide the icon from a URL, you can use:
    // `iconRegistry.addSvgIcon('thumbs-up', sanitizer.bypassSecurityTrustResourceUrl('icon.svg'));`
    iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));
  }



  onChangePassword(){
    this.onToggleViewState.next(StateView.resetPassword);
  }

  onEditButton() {
    this.onToggleViewState.next(StateView.edit);
  }

  onDeleteButton() {
   this.onToggleViewState.next(StateView.delete);
  }
}
