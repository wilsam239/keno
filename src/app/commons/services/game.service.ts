import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { SetupModel } from "src/app/setup/setup.component"
import { getRandom, MASTER_LIST } from "../global"

const DEFAULT_SETUP: SetupModel = {
  bet: 10,
  games: 1,
  choices: getRandom(MASTER_LIST, 40),
  numbers: 40,
  skipVisuals: false,
}
@Injectable({
  providedIn: "root",
})
export class GameService {
  public dialogOpened = false
  private _setup: BehaviorSubject<SetupModel> = new BehaviorSubject(
    DEFAULT_SETUP
  )

  constructor() {}

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
