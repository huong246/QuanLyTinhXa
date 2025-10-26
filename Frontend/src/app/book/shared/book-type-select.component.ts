import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { BookType } from '@proxy/entities';
import { BookTypeOptions } from './book.const';


@Component({
  selector: 'app-book-type-select',
  standalone: true,
  imports: [SharedModule],
  template: `
    <nz-select
      [nzPlaceHolder]="placeholder"
      [nzAllowClear]="allowClear"
      [ngModel]="value"
      (ngModelChange)="onChangeValue($event)"
      (blur)="onTouched()"
    >
      <nz-option
        *ngFor="let item of options"
        [nzLabel]="item[labelKey]"
        [nzValue]="item[valueKey]"
      ></nz-option>
    </nz-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BookTypeSelectComponent),
      multi: true
    }
  ]
})
export class BookTypeSelectComponent implements ControlValueAccessor {
  @Input() options: any[] = BookTypeOptions;
  @Input() placeholder = 'Chọn...';
  @Input() allowClear = true;
  @Input() labelKey = 'label';
  @Input() valueKey = 'value';

  value: any;

  onChange = (value: any) => {
  };
  onTouched = () => {
  };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChangeValue(value: any) {
    this.value = value;
    this.onChange(value);
  }
}
