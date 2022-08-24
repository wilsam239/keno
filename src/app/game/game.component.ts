import { Component, OnDestroy, OnInit } from "@angular/core"
import { Subscription, tap } from "rxjs"
import { MASTER_LIST } from "../commons/global"
import { GameService } from "../commons/services/game.service"

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  subs: Subscription[] = []
  title = "game"

  tiles = MASTER_LIST

  constructor(public gs: GameService) {}

  ngOnInit() {
    this.subs.push(
      this.gs.setup
        .pipe(
          tap((setup) => {
            console.log(setup)
          })
        )
        .subscribe()
    )
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe())
  }
}
