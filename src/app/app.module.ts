import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DatabaseService } from './core/services/database/database.service';


export function initializeFactory(init: DatabaseService) {
  return () => init.initialize();
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatabaseService,
  {
    provide: APP_INITIALIZER,
    useFactory: initializeFactory,
    deps: [DatabaseService],
    multi: true
  }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
