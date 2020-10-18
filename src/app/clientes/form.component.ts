import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from  '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo:string = "Crear Cliente";
  private errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente():void{
    this.activedRoute.params.subscribe(params =>{
      let id = params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }


  create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con éxito!` , 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error("Código del error desde el backend: " + err.status);
        console.error(err.error.errors);

      }
    )
  }

  update(): void{
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error("Código del error desde el backend: " + err.status);
        console.error(err.error.errors);

      }
    )
  }
}
