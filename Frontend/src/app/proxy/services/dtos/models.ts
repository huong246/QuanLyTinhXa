import type { EntityDto, PagedResultRequestDto } from '@abp/ng.core';
import type { BookType } from '../../entities/book-type.enum';

export interface BasePagedResultRequestDto extends PagedResultRequestDto {
  filter?: string;
  filterFts?: string;
}

export interface BookDto extends EntityDto<number> {
  code?: string;
  name?: string;
  type: BookType;
  publishDate?: string;
  price: number;
}

export interface BookPagedRequestDto extends BasePagedResultRequestDto {
  type?: BookType;
}

export interface CreateUpdateBookDto {
  code?: string;
  name?: string;
  type: BookType;
  publishDate?: string;
  price: number;
}

export interface CreateUpdateProvinceDto {
  code: string;
  name: string;
}

export interface CreateUpdateWardDto {
  code: string;
  name: string;
  provinceCode: string;
}

export interface ProvinceDto extends EntityDto<number> {
  code?: string;
  name?: string;
  wards: WardDto[];
}

export interface ProvincePagedRequestDto extends BasePagedResultRequestDto {
}

export interface WardDto extends EntityDto<number> {
  code?: string;
  name?: string;
  provinceCode?: string;
}

export interface WardPagedRequestDto extends BasePagedResultRequestDto {
  provinceCode?: string;
}
