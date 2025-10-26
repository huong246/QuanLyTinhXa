import type { CreateUpdateProvinceDto, ProvinceDto, ProvincePagedRequestDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  apiName = 'Default';
  

  checkWardExistence = (provinceId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'GET',
      url: '/check-ward-exist',
      params: { provinceId },
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateProvinceDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProvinceDto>({
      method: 'POST',
      url: '/create-province',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/delete-province',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProvinceDto>({
      method: 'GET',
      url: '/get-province-by-id',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ProvincePagedRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProvinceDto>>({
      method: 'POST',
      url: '/get-list-province',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  update = (id: number, input: CreateUpdateProvinceDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProvinceDto>({
      method: 'POST',
      url: '/update-province',
      params: { id },
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
