import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreModule, PagedResultDto } from '@abp/ng.core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NzCellAlignDirective,
  NzTableComponent, NzTbodyComponent, NzTheadComponent,
  NzThMeasureDirective
} from 'ng-zorro-antd/table';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProvinceDto } from '@proxy/services/dtos';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { ProvinceService } from '@proxy/services';
import { CreateOrUpdateProvinceComponent } from './create-or-update/create-or-update.component';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProvinceDetailComponent } from './province-detail/province-detail.component';


@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  imports: [
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

    CreateOrUpdateProvinceComponent,
    ProvinceDetailComponent
  ],
  standalone: true,
  styleUrl: './province.component.scss'
})
export class ProvinceComponent  implements OnInit, OnDestroy {
  province: PagedResultDto<ProvinceDto> = {
    items: [],
    totalCount: 0
  } as PagedResultDto<ProvinceDto>

  searchForm: FormGroup;
  loading = false;
  pageIndex = 1;
  maxResultCount: number = 10;

  private destroy$ = new Subject<void>();

  constructor(private provinceService: ProvinceService,
              private fb: FormBuilder, private modal: NzModalService) {
    this.searchForm = this.fb.group({
      filter: [''],
      type: [null]
    });
  }

  ngOnInit() {

    this.loadProvinces();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }



  loadProvinces() {
    this.loading = true;
    const skipCount = (this.pageIndex - 1) * this.maxResultCount;
    const params = {
      filter: this.searchForm.get('filter')?.value,
      skipCount: skipCount,
      maxResultCount: this.maxResultCount,
    };
    this.provinceService.getList(params).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(response => {
      this.province = response;
    });
  }


  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadProvinces();
  }

  onPageSizeChange(size: number) {
    this.maxResultCount = size;
    this.pageIndex = 1;
    this.loadProvinces();
  }

  resetSearch() {
    this.searchForm.reset(
      {
        filter: '',
      }
    );
    this.pageIndex = 1;
    this.loadProvinces();
  }

  search() {
    this.pageIndex = 1;
    this.loadProvinces();
  }


  onDelete(province: ProvinceDto) {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa',
      nzContent: `Bạn có chắc chắn muốn xóa tỉnh/thành phố này không?`,
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Hủy',
      nzOnOk: () => this.executeDelete(province.id)
    });
  }

  executeDelete(id: number) {
    this.loading = true;
    this.provinceService.delete(id).pipe(finalize(() => {
      this.loading = false;
    }),
      ).subscribe({
      next: () => {
        this.loadProvinces();
      },
      error: (err) => {
        console.error('Lỗi xảy ra khi xóa:', err);
      }
    });
  }
  onModalSaved(){
    this.loadProvinces();
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  showProvinceDetail(provinceId: number) {
    this.modal.create({
      nzTitle: 'Chi tiết về Tỉnh',
      nzContent: ProvinceDetailComponent,
      nzData: {
        provinceId: provinceId,
      },
      nzClassName: 'province-detail',
      nzFooter: null
    });
  }

}
