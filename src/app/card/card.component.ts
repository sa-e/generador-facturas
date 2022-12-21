import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, MaxLengthValidator, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Gasto} from './models';
import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { jsPDF } from "jspdf";
import {MatDividerModule} from '@angular/material/divider';


@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  total: number = 0
  gastos: Gasto[] = []

  inputGasto = new FormControl();
  inputCantidad = new FormControl(1);
  inputDetalle = new FormControl('');

  agregarGasto(){    
    if(this.inputDetalle.value && this.inputGasto.value && this.inputCantidad.value){
    const nuevoGasto : Gasto = {
      id: Math.floor(Math.random() * 999999),
      monto: this.inputGasto.value,
      detalle: this.inputDetalle.value,
      cantidad: this.inputCantidad.value
    }
    this.gastos.push(nuevoGasto)
    this.total = this.total + (nuevoGasto.monto * nuevoGasto.cantidad)
    this.inputDetalle.reset()
    this.inputGasto.reset()
    this.inputCantidad.setValue(1)
  }
  }

  borrarGasto(gasto: Gasto){
    this.gastos = this.gastos.filter(x=>x.id != gasto.id)
    this.total = this.total - (gasto.monto * gasto.cantidad)
  }

  limpiar(){
    this.total= 0
    this.gastos =[]
    this.inputDetalle.reset()
    this.inputGasto.reset()
    this.inputCantidad.setValue(1)
  }

  imprimir(){
    const img = new Image()
    img.src = './../../assets/icono-factura.png'    
    if(this.total !== 0){
    const date = new Date();
    const fecha = date.toLocaleString();
    const doc = new jsPDF();    
    doc.addImage(img, 'png', 100, 10, 16, 16)
    doc.setFont("Arial");
    doc.setFontSize(12);
    let i = 20
    while (i<190){
      doc.text('-',i,30)
      doc.text('-',i,38)
      i = i+1
    }
    i=20
    doc.text(fecha.slice(0,-3),20,10);
    doc.setFontSize(16);
    doc.text('DETALLES DE FACTURA',75,35);
    doc.setFontSize(12);
    doc.text('SUBTOTAL',20,45)
    doc.text('DETALLE',55,45)
    let cont = 45
    this.gastos.forEach(gasto => {
      cont = cont + 5
      doc.text('$'+(gasto.monto * gasto.cantidad).toString(),20,cont)
      doc.text('x'+gasto.cantidad+'  '+gasto.detalle.toUpperCase()+' - $'+gasto.monto +'(P/U)',55,cont);
    });
    cont= cont+5
    while (i<190){
      doc.text('-',i,cont)
      i = i+1
    }
    cont=cont+10
    doc.setFontSize(18)
    doc.text('TOTAL: $'+this.total.toLocaleString(),20,cont)
    const title = 'factura'+fecha.slice(0,-3)
    doc.save(title)
    }   
  }
  constructor() { }

  ngOnInit(): void {
  }

 
  }

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatGridListModule,    
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    BrowserModule
  ]
})
export class CardModule { }