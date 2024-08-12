import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserRepositoryService } from '../core/services/user-repository.service';
import { DatabaseService } from '../core/services/database/database.service';
import { RxCollection, RxDatabase, RxDocument } from 'rxdb';
import { Subscription } from 'rxjs';
import { User } from '../core/services/types/user.types';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';

import { Toast } from '@capacitor/toast';

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
  public queryStr: String = ''

  constructor(
    private databaseService: DatabaseService,
    private alertController: AlertController,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.usersCollection = this.databaseService.getDatabase()["users"]
  }
  ngOnDestroy(): void {
    this.usersSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.formUser = this.fb.group({
      id: new FormControl(null),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, []),
      username: new FormControl(null, [Validators.required])
    })
    this.getUsers()
  }

  get id() { return this.formUser.get("id") }
  get firstName() { return this.formUser.get("firstName") }
  get lastName() { return this.formUser.get("lastName") }
  get username() { return this.formUser.get("username") }

  async search(query: string | undefined | null) {
    this.queryStr = query ? query.toString().toLowerCase() : ''
    //console.log(this.queryStr)
    this.getUsers()
  }

  private async getUsers() {
    this.usersSub?.unsubscribe()
    const query =
      this.queryStr ?
        this.usersCollection.find({
          selector: {
            username: { $regex: `${this.queryStr}`, $options: 'i' }
          },
          limit: 10,
          sort: [
            { name: 'asc' }
          ]
        }) :
        this.usersCollection.find({
          limit: 10,
          sort: [
            { name: 'asc' }
          ]
        })
    this.usersSub = query.$.subscribe({
      next: (result: RxDocument[]) => {
        this.users = result.map(item => item._data) as Array<any>
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  public async saveUser(modal: IonModal) {
    try {
      const id = this.id?.value
      if (id) {
        // Update
        const document: RxDocument = await this.usersCollection.findOne(id).exec()
        if (document) {
          const userUpdate: User = {
            firstName: this.firstName?.value,
            lastName: this.lastName?.value,
            username: this.username?.value
          }
          const result = await document.update({
            $set: userUpdate
          })
          if (result) {
            const toast = await this.toastController.create({
              header: 'Updated user',
              color: 'secondary',
              icon: 'trash',
              duration: 4000,
              swipeGesture: 'vertical',
              buttons: [
                {
                  icon: 'close',
                  htmlAttributes: {
                    'aria-label': 'close',
                  },
                },
              ],
            });
            await toast.present()
          }
        }
      } else {
        // Insert
        const userObj = this.formUser.value as User
        userObj.id = uuidv4()
        const result = await this.usersCollection.insert(userObj)
        console.log(result)
      }
      this.formUser.reset()
      modal.dismiss()
    } catch (ex: any) {
      console.log(`Error: ${ex.message || ex}`)
    }
  }

  public async delete(item: User) {
    try {
      const alert = await this.alertController.create({
        header: 'Delete',
        message: "Do you want to delete this record?",
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
          },
          {
            text: 'YES',
            role: 'confirm'
          }
        ]
      })
      alert.present()
      const { role, data } = await alert.onWillDismiss()
      if (role == 'confirm') {
        const document: RxDocument = await this.usersCollection.findOne(item.id/*{
          selector: {
            id: item.id
          }
        }*/).exec()
        if (document) {
          const result = await document.remove()
          if (result.deleted) {
            const toast = await this.toastController.create({
              header: 'Deleted user',
              color: 'success',
              icon: 'trash',
              duration: 4000,
              swipeGesture: 'vertical',
              buttons: [
                {
                  icon: 'close',
                  htmlAttributes: {
                    'aria-label': 'close',
                  },
                },
              ],
            });
            await toast.present()
          }
        }
      }
    } catch (ex: any) {
      console.log(`Error: ${ex.message || ex}`)
    }
  }

  public async update(item: User, modal: IonModal) {
    try {
      this.id?.setValue(item.id)
      this.firstName?.setValue(item.firstName)
      this.lastName?.setValue(item.lastName)
      this.username?.setValue(item.username)
      await modal.present()
      //const 

    } catch (ex: any) {
      console.log(`Error: ${ex.message || ex}`)
    }
  }
}
