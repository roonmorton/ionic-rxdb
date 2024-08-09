import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserRepositoryService } from '../core/services/user-repository.service';
import { DatabaseService } from '../core/services/database/database.service';
import { RxCollection, RxDatabase, RxDocument } from 'rxdb';
import { Subscription } from 'rxjs';
import { User } from '../core/services/types/user.types';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  private usersCollection!: RxCollection
  private usersSub?: Subscription

  public users: Array<User> = []
  public formUser!: FormGroup

  constructor(
    private databaseService: DatabaseService,
    private fb: FormBuilder
  ) {
    this.usersCollection = this.databaseService.getDatabase()["users"]
  }
  ngOnDestroy(): void {
    this.usersSub?.unsubscribe()
  }

  ngOnInit(): void {

    this.formUser = this.fb.group({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required])
    })



    this.getUsers()
    //console.log(this.databaseService.getDatabase("database"));

    //console.log()
  }

  get firstName() { return this.formUser.get("firstName") }
  get lastName() { return this.formUser.get("lastName") }
  get username() { return this.formUser.get("username") }


  async getUsers() {
    const query = this.usersCollection.find()
    
    //query.sort("id")
    this.usersSub = query.$.subscribe({
      next: (result: RxDocument[]) => {

        //this.users = result

        this.users = result.map(item => item._data) as Array<any>

        //this.users =  result.map(item => { item._data}) as User[]
      },
      error: (err) => {
        console.log(err);

      }
    })
    //    console.log(await this.usersCollection.get$());
  }


  public async saveUser(modal: IonModal) {
    try {
      const userObj = this.formUser.value as User

      userObj.id = uuidv4()
      //console.log(userObj);


      const result = await this.usersCollection.insert(userObj)
      //console.log(result);

      modal.dismiss()

    } catch (ex: any) {
      console.log(`Error: ${ex.message || ex}`)

    }
  }
}
