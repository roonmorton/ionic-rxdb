import { Injectable } from '@angular/core';
import { addRxPlugin, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { environment } from 'src/environments/environment.prod';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { databasesConfig } from '../../schemas/MyDataBaseSchema';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {



  //public usersDatabase!: any

  private dbs: any = {}

  constructor() { }


  async initialize() {
    try {
      if (!environment.production)
        addRxPlugin(RxDBDevModePlugin)

      for (const config of databasesConfig) {
        const { dbName, collections } = config;
        const db = await createRxDatabase({
          name: dbName,
          storage: getRxStorageDexie()
        });
        await db.addCollections(collections)
        this.dbs[dbName] = db
      }

    } catch (ex: any) {
      switch (ex.code) {
        case 'DB6': {
          console.log("Error: Esquema alterado")
        }
      }
      //console.log(JSON.stringify(ex))
      console.log(ex.code)
    }
  }


  getDatabaseByName(collectionName: string) {
    return this.dbs[collectionName]
  }

  getDatabase() {
    return this.dbs['database']
  }

}
