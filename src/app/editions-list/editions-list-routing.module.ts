import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditionsListPage } from './editions-list.page';

const routes: Routes = [
  {
    path: '',
    component: EditionsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditionsListPageRoutingModule {}
