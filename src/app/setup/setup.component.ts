import { Component, OnDestroy, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { AppRoutes, NUMBER_OPTIONS } from "../commons/global"
import { GameService } from "../commons/services/game.service"

export interface SetupModel {
  bet: number | undefined
  games: number | undefined
  numbers: number | undefined
  choices: number[]
  playUntilGreaterThan?: number
  skipVisuals?: boolean
}
@Component({
  selector: "app-setup",
  templateUrl: "./setup.component.html",
  styleUrls: ["./setup.component.scss"],
})
export class SetupComponent implements OnInit, OnDestroy {
  title = "setup"
  setupModel: SetupModel = {
    bet: undefined,
    games: undefined,
    numbers: undefined,
    choices: [],
  }
  numberOptions = NUMBER_OPTIONS

  constructor(private router: Router, private gs: GameService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  finalise() {
    this.gs.setup.next(this.setupModel)
    this.router.navigate([AppRoutes.PLAY])
  }
}
