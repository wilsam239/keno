import { Component, OnDestroy, OnInit } from "@angular/core"
import {
  BehaviorSubject,
  filter,
  interval,
  isObservable,
  Observable,
  Subscription,
  takeUntil,
  tap,
} from "rxjs"
import { isSubscription } from "rxjs/internal/Subscription"
import { DRAW_SIZE, getRandom, MASTER_LIST } from "../commons/global"
import { GameService } from "../commons/services/game.service"

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = []
  title = "game"

  tiles = MASTER_LIST
  drawTime = 1000
  private _results: number[] = []
  drawn: number[] = []

  private allNumbersDrawn = new BehaviorSubject(false)

  headCount = 0
  tailCount = 0

  constructor(public gs: GameService) {
    this._results = getRandom(this.tiles, DRAW_SIZE)
  }

  ngOnInit() {
    this.sub(
      this.gs.setup.pipe(
        tap((setup) => {
          console.log(setup)
        })
      ),
      interval(this.drawTime).pipe(
        takeUntil(this.allNumbersDrawn.pipe(filter((b) => b))),
        tap(() => {
          console.log("Revealing a new tile")
          const newTile = this._results.at(this.drawn.length)

          if (newTile) {
            console.log("Revealed: " + newTile)
            const tile = document.getElementById("tile-" + newTile)
            if (tile) {
              tile.classList.add(
                "selected-" + Math.ceil(newTile / 10),
                "selected"
              )
            }
            newTile <= 40 ? (this.headCount += 1) : (this.tailCount += 1)
            this.drawn.push(newTile)
          } else {
            this.allNumbersDrawn.next(true)
          }
        })
      ),
      this.allNumbersDrawn.pipe(
        filter((b) => b),
        tap(() => console.log("All numbers drawn!"))
      )
    )
  }

  ngOnDestroy() {
    this._subs.forEach((s) => s.unsubscribe())
  }

  sub(...s: (Subscription | Observable<any>)[]) {
    s.forEach((_s) => {
      if (isObservable(_s)) {
        this._subs.push(_s.subscribe())
      } else if (isSubscription(s)) {
        this._subs.push(_s)
      }
    })
  }
}
