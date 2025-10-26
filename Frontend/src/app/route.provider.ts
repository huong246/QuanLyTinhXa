import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) {
  return () => {
    routesService.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/book-store',
        name: 'Cửa hàng sách',
        iconClass: 'fas fa-book',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/books',
        name: 'Danh mục sách',
        parentName: 'Cửa hàng sách',
        layout: eLayoutType.application,
      },
      {
        path: '/address',
        name: 'Danh mục địa giới',
        iconClass: 'fas fa-globe-asia',
        order: 3,
        layout: eLayoutType.application,
      },
      {
        path: '/provinces',
        name: 'Danh mục tỉnh',
        parentName: 'Danh mục địa giới',
        layout: eLayoutType.application,
      },
      {
        path: '/wards',
        name: 'Danh mục xã phường',
        parentName: 'Danh mục địa giới',
        layout: eLayoutType.application,
      }
    ]);
  };
}
