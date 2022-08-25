import { Injectable } from "@angular/core"
import { BehaviorSubject, Subject } from "rxjs"
import { SetupModel } from "src/app/setup/setup.component"
import { getRandom, MASTER_LIST } from "../global"

const DEFAULT_SETUP: SetupModel = {
  bet: 10,
  games: 2,
  choices: getRandom(MASTER_LIST, 40),
  numbers: 40,
  skipVisuals: false,
}
@Injectable({
  providedIn: "root",
})
export class GameService {
  public dialogOpened = false
  private _dialogClose = new Subject()
  private _setup: BehaviorSubject<SetupModel> = new BehaviorSubject(
    DEFAULT_SETUP
  )

  constructor() {}

  dialogClose() {
    this.dialogOpened = false
    this._dialogClose.next(true)
  }

  get dialogClosed() {
    return this._dialogClose
  }

  get setup() {
    return this._setup
  }
  get bet() {
    return this._setup.getValue().bet
  }

  get games() {
    return this._setup.getValue().games
  }

  get numbers() {
    return this._setup.getValue().numbers
  }

  get choices() {
    return this._setup.getValue().choices
  }
}
