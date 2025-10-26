import { Component, inject, OnInit } from '@angular/core';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { ProvinceService } from '@proxy/services';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { ProvinceDto  } from '@proxy/services/dtos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-province-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzAlertComponent,
    NzSpinComponent
  ],
  templateUrl: './province-detail.component.html',
  styleUrl: './province-detail.component.scss'
})
export class ProvinceDetailComponent implements OnInit{
  private provinceService = inject(ProvinceService);
  private modalData: { provinceId: number } = inject(NZ_MODAL_DATA);
  province: ProvinceDto | null = null;
  isLoading: boolean = true;
  ngOnInit(): void {
    const provinceId = this.modalData.provinceId;
    if (provinceId) {
      this.provinceService.get(provinceId).subscribe({
        next: (response: ProvinceDto) => {
          this.province = response;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Lỗi khi tải chi tiết Tỉnh:', err);
          this.isLoading = false;
        }
      });
    }
    else {
      console.error('Không tìm thấy provinceId trong modal data');
      this.isLoading = false;
    }
  }
}
