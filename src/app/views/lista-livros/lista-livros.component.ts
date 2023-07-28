import { VolumeInfo, ImageLinks, Item } from './../../models/interfaces';
import { Component } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  listaLivros: Livro[];
  campoBusca: string = ''
  subscription: Subscription
  livro: Livro;

  constructor(private service: LivroService) { }

  buscarLivros() {
    this.subscription = this.service.buscar(this.campoBusca).subscribe(
      {
        next: (items) =>  {
          this.listaLivros = this.livrosResultadoParaLivros(items);
        },
        error: erro => console.error(erro),
      }
    );
  }

  // Conversão de Objeto
  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

  // .subscribe(data => this.config = {

  // })

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}



