import { Component, OnInit, OnDestroy } from '@angular/core';
import { Database, object, ref, onValue, Unsubscribe, set } from '@angular/fire/database';

interface Habitacion {
  nombre: string;
  luminaria: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  habitaciones: Habitacion[] = [
    { nombre: 'Ático', luminaria: false },
    { nombre: 'Baño', luminaria: false },
    { nombre: 'Cocina', luminaria: false },
    { nombre: 'Dormitorio', luminaria: false },
    { nombre: 'Garaje', luminaria: false },
    { nombre: 'Sala', luminaria: false }
  ];

  firebaseSubscription!: Unsubscribe;

  constructor(private database: Database) {}

  ngOnInit() {
    const route = ref(this.database, "/casa");
    this.firebaseSubscription = onValue(route, snapshot => {
      const valores_db = snapshot.val();
      this.actualizarEstado(valores_db);
    });
  }

  ngOnDestroy() {
    if (this.firebaseSubscription) {
      this.firebaseSubscription();
    }
  }

  actualizarEstado(valores: any) {
    for (let habitacion in valores) {
      const index = this.habitaciones.findIndex(hab => hab.nombre.toLowerCase() === habitacion.toLowerCase());
      if (index !== -1) {
        this.habitaciones[index].luminaria = valores[habitacion];
      }
    }
  }
}