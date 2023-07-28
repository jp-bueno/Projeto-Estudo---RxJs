import { FormControl } from '@angular/forms';
import { VolumeInfo, ImageLinks, Item, LivrosResultado } from './../../models/interfaces';
import { Component } from '@angular/core';
import { Subscription, catchError, debounceTime, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA =300
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = ''
  livrosResultado: LivrosResultado

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges
  .pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro)
      return of()
    })
  )

  //Quando ela representa um observable utilize o $
  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []),
      map((items) => this.livrosResultadoParaLivros(items)),
      catchError(erro => {
        console.log(erro)
        return throwError(() => Error(this.mensagemErro = 'Ops ocorreu um erro. Recarregue a aplicação'))
      })
    )

  // Conversão de Objeto
  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}



