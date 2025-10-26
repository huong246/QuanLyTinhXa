import type { CreateUpdateWardDto, WardDto, WardPagedRequestDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WardService {
  apiName = 'Default';


  create = (input: CreateUpdateWardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WardDto>({
      method: 'POST',
      url: '/create-ward',
      body: input,
    },
    { apiName: this.apiName,...config });


  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/delete-ward',
      params: { id },
    },
    { apiName: this.apiName,...config });


  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WardDto>({
      method: 'GET',
      url: `/api/app/ward/${id}`,
    },
    { apiName: this.apiName,...config });


  //dung khi muon lay rieng 1 danh sach xa/phuong cua 1 tinh (tuy nhien thi ham search theo province cung dang lam duoc phan nay + phan trang)
  getListWardInAProvince = (provinceCode: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WardDto[]>({
      method: 'POST',
      url: '/get-list-ward-in-a-province',
      params: { provinceCode },
    },
    { apiName: this.apiName,...config });


  getList = (input: WardPagedRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WardDto>>({
      method: 'POST',
      url: '/get-list-ward',
      body: input,
    },
    { apiName: this.apiName,...config });


  update = (id: number, input: CreateUpdateWardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WardDto>({
      method: 'PUT',
      url: '/update-ward',
      params: { id },
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
