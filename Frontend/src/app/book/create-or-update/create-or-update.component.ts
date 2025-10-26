import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BookDto, CreateUpdateBookDto } from '@proxy/services/dtos';
import { BookService } from '@proxy/services';

@Component({
  selector: 'app-create-update-book-modal',
  templateUrl: './create-or-update.component.html'
})
export class CreateOrUpdateComponent {

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<void>();
  visible = false;
  bookId?: number;
  visibleChange = new EventEmitter<boolean>();

  form: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      type: [null, [Validators.required]],
      publishDate: [null, [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(2000)]]
    });
  }

  openModal(bookId?: number | null): void {
    this.visible = true;
    this.bookId = bookId;
    this.isEditMode = false;
    if (bookId && bookId > 0) {
      this.isEditMode = true;
      this.loadBook();
    }
  }

  loadBook(): void {
    this.loading = true;
    this.bookService
      .get(this.bookId!)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (book: BookDto) => {
          this.form.patchValue({
            code: book.code,
            name: book.name,
            type: book.type,
            publishDate: new Date(book.publishDate),
            price: book.price
          });
        },
        error: (error) => {
          this.message.error('Không thể tải thông tin sách');
          this.handleCancel();
        }
      });
  }

  handleOk(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.submitting = true;
    const formValue = this.form.value;

    const input: CreateUpdateBookDto = {
      code: formValue.code,
      name: formValue.name,
      type: formValue.type,
      publishDate: formValue.publishDate.toISOString(),
      price: formValue.price
    };

    const request$ = this.isEditMode
      ? this.bookService.update(this.bookId!, input)
      : this.bookService.create(input);

    request$
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => {
          this.message.success(
            this.isEditMode ? 'Cập nhật sách thành công' : 'Thêm mới sách thành công'
          );
          this.onSaved.emit();
          this.handleCancel();
        },
        error: (error) => {
          this.message.error(
            this.isEditMode ? 'Cập nhật sách thất bại' : 'Thêm mới sách thất bại'
          );
        }
      });
  }

  handleCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form.reset();
    this.bookId = undefined;
    this.isEditMode = false;
  }

  // Validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'Trường này là bắt buộc';
    }
    if (field.errors['maxlength']) {
      return `Tối đa ${field.errors['maxlength'].requiredLength} ký tự`;
    }
    if (field.errors['min']) {
      return `Giá trị tối thiểu là ${field.errors['min'].min}`;
    }
    return 'Giá trị không hợp lệ';
  }

  formatterVND = (value: number): string => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  parserVND = (value: string): string => {
    return value.replace(/,/g, '');
  };
}
