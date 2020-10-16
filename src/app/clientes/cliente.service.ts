import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = "http://localhost:8080/api/clientes";
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type' :'application/json'});

  constructor(private http: HttpClient, private router: Router) { }


  getClientes() : Observable<Cliente[]> {
    // return of(CLIENTES);
    return this.http.get(this.urlEndPoint).pipe(
      tap( response => { // tap: sirve para trabajar con los datos o realizar alguna tarea antes de procesar
        let clientes = response as Cliente[];
        console.log('ClienteService: tap 1');
        clientes.forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),
      map(response => { 
        let clientes = response as Cliente[]; 
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          let datePipe = new DatePipe('es-MX');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          return cliente;
        });
      }),
      tap( response => {
          console.log('ClienteService: tap 2');
          response.forEach( cliente => {
            console.log(cliente.nombre);
        })
      }),
    ); // cast to convert in Client[]
  }

  /** 
   * Metodo que crea un cliente nuevo, recibe como parametro un cliente (formato: json)
   * @param Cliente objeto cliente en formato json
   * @return Cliente objeto cliente creado
  */
  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status == 400){ // Error 400 Bad Request
          return throwError(e);
        }
        
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status == 400){ // Error 400 Bad Request
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.mensaje.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
