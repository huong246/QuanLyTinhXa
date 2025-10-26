import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NzCellAlignDirective,
  NzTableComponent,
  NzTbodyComponent,
  NzTheadComponent,
  NzThMeasureDirective
} from 'ng-zorro-antd/table';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, PagedResultDto } from '@abp/ng.core';
import {  WardDto } from '@proxy/services/dtos';
import { finalize, Subject } from 'rxjs';
import { WardService } from '@proxy/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateOrUpdateWardComponent } from './create-or-update/create-or-update.component';
import { WardDetailComponent } from './ward-detail/ward-detail.component';

@Component({
  selector: 'app-ward',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    CommonModule,
    ReactiveFormsModule,
    CoreModule,

    NzRowDirective,
    NzColDirective,
    NzIconDirective,
    NzTooltipDirective,
    NzButtonComponent,

    NzInputGroupComponent,
    NzInputDirective,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,

    NzTableComponent,
    NzTheadComponent,
    NzTbodyComponent,
    NzThMeasureDirective,
    NzCellAlignDirective,

    CreateOrUpdateWardComponent,

  ],
  templateUrl: './ward.component.html',
  standalone: true,
  styleUrl: './ward.component.scss'
})
export class WardComponent implements OnInit, OnDestroy {

  ward: PagedResultDto<WardDto> = {
    items: [],
    totalCount: 0
  } as PagedResultDto<WardDto>

  searchForm: FormGroup;
  loading = false;
  pageIndex = 1;
  maxResultCount: number = 10;

  private destroy$ = new Subject<void>();

  constructor(private wardService: WardService,
              private fb:FormBuilder,
              private modal: NzModalService) {
    this.searchForm = this.fb.group({
      filter: [''],
      type: [null]
    });
  }

  ngOnInit() {
    this.loadWards();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadWards()
  {
    this.loading = true;
    const skipCount = (this.pageIndex - 1) * this.maxResultCount;
    const params =
      {
        filter: this.searchForm.get('filter')?.value,
        skipCount: skipCount,
        maxResultCount: this.maxResultCount
      };
    this.wardService.getList(params).pipe(
      finalize(() => this.loading = false),
      ).subscribe(
        response => {
          this.ward = response;
        });
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadWards();
  }

  onPageSizeChange(size: number) {
    this.maxResultCount = size;
    this.pageIndex = 1;
    this.loadWards();
  }

  resetSearch() {
    this.searchForm.reset(
      {
        filter: '',
      }
    );
    this.pageIndex = 1;
    this.loadWards();
  }

  search()
  {
    this.pageIndex =1;
    this.loadWards();
  }

  onDelete(ward: WardDto) {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa',
      nzContent: `Bạn có chắc chắn muốn xóa xã/phường/thị trấn này không?`,
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Hủy',
      nzOnOk: () => this.executeDelete(ward.id)
    });
  }
  executeDelete(id: number) {
    this.loading = true;
    this.wardService.delete(id).pipe(finalize(() => this.loading = false)).subscribe(
      {
        next: () => {
          this.loadWards();
        },
        error: (err) =>
        {
          console.error('Lỗi xảy ra khi xóa: ',err);
        }
      });
  }
  onModalSaved(){
    this.loadWards();
  }
  trackById(index: number, item: any): number {
    return item.id;
  }

  showWardDetail(wardId: number) {
    this.modal.create({
      nzTitle: 'Chi tiết về Xã/Phường',
      nzContent: WardDetailComponent,
      nzData: {
        wardId: wardId,
      },
      nzClassName: 'ward-detail',
      nzFooter: null
    });
  }
}
