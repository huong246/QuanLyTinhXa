import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { BookType } from '@proxy/entities';
import { BookService } from '@proxy/services';
import { BookDto } from '@proxy/services/dtos';


@Component({
  selector: 'app-book-list',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {
  book: PagedResultDto<BookDto> = {
    items: [],
    totalCount: 0
  } as PagedResultDto<BookDto>;

  searchForm: FormGroup;
  loading = false;
  pageIndex = 1;
  maxResultCount: number = 10;

  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      filter: [''],
      type: [null]
    });
  }

  ngOnInit() {
    this.setupSearch();
    this.loadBooks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch() {
    // Debounce text search
    this.searchForm.get('filter')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pageIndex = 1;
        this.loadBooks();
      });

    // Immediate search for type change
    this.searchForm.get('type')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 1;
        this.loadBooks();
      });
  }

  loadBooks() {
    this.loading = true;
    const params = {
      filter: this.searchForm.get('filter')?.value,
      type: this.searchForm.get('type')?.value,
      skipCount: 0,
      maxResultCount: this.maxResultCount
    };
    this.bookService.getList(params)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(response => {
        this.book = response;
      });
  }

  onPageChange(page: number) {
    this.pageIndex = page;
  }

  onPageSizeChange(size: number) {
    this.maxResultCount = size;
    this.pageIndex = 1;
  }

  resetSearch() {
    this.searchForm.reset({
      filter: '',
      type: null
    });
    this.pageIndex = 1;
  }


  trackById(index: number, item: any): any {
    return item.id;
  }

  onDelete(book: BookDto) {
    // Handle delete book
  }

  onModalSaved() {
    this.loadBooks();
  }
}
