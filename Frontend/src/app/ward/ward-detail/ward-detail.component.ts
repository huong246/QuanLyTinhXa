import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { WardService } from '@proxy/services';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { WardDto } from '@proxy/services/dtos';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-ward-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzAlertModule
  ],
  templateUrl: './ward-detail.component.html',
  styleUrl: './ward-detail.component.scss'
})
export class WardDetailComponent implements OnInit {
  private wardService = inject(WardService);
  private modalData: { wardId: number } = inject(NZ_MODAL_DATA);
  ward: WardDto | null = null;
  isLoading: boolean = true;
  ngOnInit(): void {
    const wardId = this.modalData.wardId;
    if (wardId) {

      this.wardService.get(wardId).subscribe({

        next: (response: WardDto) => {
          this.ward = response;
          this.isLoading = false;
        },

        error: (err) => {
          console.error('Lỗi khi tải chi tiết xã/phường:', err);
          this.isLoading = false;
        }

      });
    }
    else {
      console.error('Không tìm thấy wardId trong modal data');
      this.isLoading = false;
    }

  }
}
