import { Injectable } from '@angular/core';
import { DatabaseService } from './database/database.service';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService {

  constructor(private dataBaseService: DatabaseService) { }


  getUsers(){
    //console.log(this.dataBaseService.usersDatabase.users)
  }




}
