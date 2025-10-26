import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ProvinceService } from '@proxy/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize, switchMap } from 'rxjs';
import { CreateUpdateProvinceDto, ProvinceDto } from '@proxy/services/dtos';
import { NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { CoreModule } from '@abp/ng.core';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';

import { NzInputDirective } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-create-or-update-province',
  standalone: true,
  imports: [
    NzModalComponent,
    NzSpinComponent,
    CoreModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,

    NzModalContentDirective,
    NzFormDirective,
    NzInputDirective
  ],
  templateUrl: './create-or-update.component.html',
  styleUrl: './create-or-update.component.scss'
})
export class CreateOrUpdateProvinceComponent {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<void>();
  visible = false;
  provinceId?: number;
  visibiChange = new EventEmitter<boolean>();

  form: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  isCodeEditable = false;

  constructor(
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private message: NzMessageService,
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(256)]]
    });
  }

  openModal(provinceId: number | null) {
    this.visible = true;
    this.provinceId = provinceId;

    this.isEditMode = false;
    this.form.get('code')?.enable();
    this.isCodeEditable = true;
    if(provinceId && provinceId>0)
    {
      //co id truyen vao => edit, khong co => add
      this.isEditMode = true;
      this.loadProvince();
    }

  }
  loadProvince() {
    this.loading = true;
    this.provinceService.checkWardExistence(this.provinceId).pipe(switchMap((isUsedByWard: boolean) => {
        this.isCodeEditable = !isUsedByWard;
        return this.provinceService.get(this.provinceId!);
      }),
      finalize(() => (this.loading = false)))
      .subscribe(
        {
          next:(province: ProvinceDto) =>
          {
            this.form.reset();
            this.form.patchValue({
              code: province.code,
              name: province.name,
            });
            if (!this.isCodeEditable) {
              this.form.get('code')?.disable();
            } else {
              this.form.get('code')?.enable();
            }
          },
          error: err => {
            this.message.error(err.message);
            this.handleCancel();
          }
        }
      );
  }

  handleCancel() {
    this.visible = false;
    this.visibiChange.emit(false);
    this.form.reset();
    this.provinceId = undefined;
    this.isEditMode = false;

    this.form.get('code')?.enable();
  }

  handleOk() {
    if(this.form.invalid)
    {
      Object.values(this.form.controls).forEach(control =>
      {
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

    const input: CreateUpdateProvinceDto ={
      code: formValue.code,
      name: formValue.name,
    };

    const request$ = this.isEditMode
      ? this.provinceService.update(this.provinceId, input)
      : this.provinceService.create(input);

    request$.pipe(
      finalize(() => (this.submitting = false)),
    ).subscribe(
      {
        next: ()=>
        {
          this.message.success(this.isEditMode ? 'Cập nhật tỉnh thành công':'Thêm tỉnh mới thành công');
          this.onSaved.emit();
          this.handleCancel();
        },
        error: err => {

          this.message.error(this.isEditMode? 'Cập nhật tỉnh thất bại' : 'Thêm tỉnh mới thất bại');
        }
      }
    );
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || field.valid) {
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
