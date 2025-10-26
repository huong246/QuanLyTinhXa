import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProvinceService, WardService } from '@proxy/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { CreateUpdateWardDto, ProvinceDto, WardDto } from '@proxy/services/dtos';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { CommonModule, NgStyle } from '@angular/common';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-create-or-update-ward',
  standalone: true,
  imports: [
    CommonModule,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzModalComponent,
    NzSpinComponent,
    ReactiveFormsModule,
    NzFormItemComponent,
    NgStyle,
    NzFormDirective,
    NzInputDirective,
    NzModalContentDirective,
    NzSelectComponent,
    NzOptionComponent,
  ],
  templateUrl: './create-or-update.component.html',
  styleUrl: './create-or-update.component.scss'
})
export class CreateOrUpdateWardComponent implements OnInit {
  private provinceService = inject(ProvinceService);
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<void>();
  visible = false;
  wardId?: number;
  visibleChange = new EventEmitter<boolean>();

  form: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  listProvinces: ProvinceDto[] = [];
  isLoadingProvinces = false;

  constructor(
    private fb: FormBuilder,
    private wardService: WardService,
    private message: NzMessageService,
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      provinceCode: [null, [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit() {
    this.loadingProvincesForDropdown();
  }
  loadingProvincesForDropdown() {
    this.isLoadingProvinces = true;
    const request = {
      filter: '',
      skipCount: 0,
      maxResultCount: 100
    };
    this.provinceService.getList(request).pipe(
      finalize(() => {
        this.isLoadingProvinces = false;
      })
    ).subscribe(result => {
      this.listProvinces = result.items;
    });
  }
  openModal(wardId: number | null) {
    this.visible = true;
    this.wardId = wardId;

    this.isEditMode = false;
    this.form.get('code')?.enable();

    if(wardId && wardId > 0)
    {
      this.isEditMode = true;
      this.form.get('code')?.disable();
      this.loadWard();
    }
  }

  loadWard() {
    this.loading = true;
    this.wardService.get(this.wardId).pipe(finalize(() => (this.loading = false))).subscribe(
      {
        next: (ward: WardDto) =>
        {
          this.form.reset();
          this.form.patchValue({
            code: ward.code,
            name: ward.name,
            provinceCode: ward.provinceCode,
          });
          this.form.get('code')?.disable();
        },
        error: err => {
          this.message.error(err.message);
          this.handleCancel();
        }
      }
    )
  }

  handleCancel()
  {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form.reset();
    this.wardId = undefined;
    this.isEditMode = false;

    this.form.get('code')?.enable();
  }

  handleOk()
  {
    if(this.form.invalid)
    {
      Object.values(this.form.controls).forEach((control) => {
        if(control.invalid)
        {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }

    this.submitting = true;
    const formValue = this.form.getRawValue();

    const input: CreateUpdateWardDto = {
      code: formValue.code,
      name: formValue.name,
      provinceCode: formValue.provinceCode,
    };
    const request$ = this.isEditMode ?
      this.wardService.update(this.wardId,  input):
      this.wardService.create(input);

    request$.pipe(finalize(() => (this.submitting = false))).subscribe(
      {
        next: () =>
        {
          this.message.success(this.isEditMode ? 'Cập nhật xã/phường/thị trấn thành công':'Thêm xã/phường/thị trấn thành công');
          this.onSaved.emit();
          this.handleCancel();
        },
        error: err => {
          this.message.error(this.isEditMode? 'Cập nhật xã/phường/thị trấn thất bại' : 'Thêm xã/phường/thị trấn mới thất bại');
        }
      }
    );
  }

  getErrorMessage(fieldName: string): string
  {
    const field = this.form.get(fieldName);
    if(!field || field.valid)
    {
      return '';
    }
    if (field.errors?.['required']) {
      return 'Trường này là bắt buộc';
    }
    if (field.errors?.['maxlength']) {
      return `Tối đa ${field.errors['maxlength'].requiredLength} ký tự`;
    }
    if (field.errors?.['min']) {
      return `Giá trị tối thiểu là ${field.errors['min'].min}`;
    }
  }

}
