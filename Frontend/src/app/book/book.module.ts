import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { SharedModule } from '../shared/shared.module';
import { CreateOrUpdateComponent } from './create-or-update/create-or-update.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BookTypeSelectComponent } from './shared/book-type-select.component';
import { BookTypeColorPipe } from './pipe/book-type-color.pipe';
import { BookTypeNamePipe } from './pipe/book-type-name.pipe';

const icons = [ PlusOutline ];
@NgModule({
  declarations: [
    BookComponent,
    CreateOrUpdateComponent
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
    NzTagModule,
    NzToolTipModule,
    BookTypeSelectComponent,
    BookTypeColorPipe,
    BookTypeNamePipe,
    NzIconModule
  ],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class BookModule {
}
