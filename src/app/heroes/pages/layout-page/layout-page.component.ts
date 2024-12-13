import { Component } from '@angular/core';
import { IconType } from '@angular/material/icon/testing';

@Component({
  selector: 'heroes-layout-page',
  standalone: false,

  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

    public sidebarItems = [
      {label: 'Listado', icon: 'label', url: './list'},
      {label: 'Agregar', icon: 'add', url: './new-hero'},
      {label: 'Buscar', icon: 'search', url: './search'},
    ]
}
