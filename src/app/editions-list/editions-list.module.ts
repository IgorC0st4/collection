import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditionsListPageRoutingModule } from './editions-list-routing.module';

import { EditionsListPage } from './editions-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditionsListPageRoutingModule
  ],
  declarations: [EditionsListPage]
})
export class EditionsListPageModule {}
