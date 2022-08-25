import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { SetupModel } from "src/app/setup/setup.component"

const DEFAULT_SETUP: SetupModel = {
  bet: 0,
  games: 2,
  choices: [],
  numbers: 0,
}
@Injectable({
  providedIn: "root",
})
export class GameService {
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
