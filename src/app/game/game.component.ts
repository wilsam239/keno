import { Component, OnDestroy, OnInit } from "@angular/core"
import {
  BehaviorSubject,
  filter,
  interval,
  isObservable,
  mergeMap,
  Observable,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from "rxjs"
import { isSubscription } from "rxjs/internal/Subscription"
import {
  DRAW_SIZE,
  getRandom,
  MASTER_LIST,
  TIME_BETWEEN_GAMES,
} from "../commons/global"
import { GameService } from "../commons/services/game.service"
import { SetupModel } from "../setup/setup.component"

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = []
  private drawSub!: Subscription

  gameNumber = 0

  tiles = MASTER_LIST
  fast = true
  drawTime = new BehaviorSubject(this.fast ? 100 : 1000)
  private _results: number[] = []
  drawn: number[] = []

  private allNumbersDrawn = new BehaviorSubject(false)
  gameFinished = false

  headCount = 0
  tailCount = 0

  secondsTilNext!: string

  config!: SetupModel

  constructor(public gs: GameService) {}

  getTimeInString(time: number) {
    return time.toLocaleString(undefined, { minimumIntegerDigits: 2 })
  }

  ngOnInit() {
    this.sub(
      this.gs.setup.pipe(
        filter((setup) => !!setup),
        tap((setup) => {
          this.config = setup
          this.draw()
        })
      ),
      this.allNumbersDrawn.pipe(
        filter((b) => b),
        tap(() => (this.gameFinished = true)),
        mergeMap(() =>
          interval(1000).pipe(
            takeUntil(
              timer(TIME_BETWEEN_GAMES).pipe(
                tap(() => {
                  this.draw()
                  this.allNumbersDrawn.next(false)
                })
              )
            ),
            tap((val) => {
              this.secondsTilNext = this.getTimeInString(
                (TIME_BETWEEN_GAMES - 1000 - 1000 * val) / 1000
              )
            })
          )
        )
      ),

      this.drawTime.pipe(
        tap((val) => console.log("Should change interval to " + val)),
        switchMap((val) => interval(val)),
        filter(() => !this.allNumbersDrawn.getValue()),
        tap((val) => {
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
      )
    )
  }

  /**
   * Reset all main variables, incremement game number and remove classes on selected numbers
   */
  draw() {
    if (this.gameNumber >= this.config.games!) {
      return
    }
    this.gameNumber += 1
    this.secondsTilNext = this.getTimeInString(TIME_BETWEEN_GAMES / 1000)
    this.gameFinished = false
    const selected = document.getElementsByClassName("selected")
    Array.from(selected).forEach((s) => {
      const classesToRemove: string[] = []
      s.classList.forEach((c) => {
        if (c.includes("selected")) {
          classesToRemove.push(c)
        }
      })
      s.classList.remove(...classesToRemove)
    })

    this.headCount = 0
    this.tailCount = 0
    this.drawn = []
    this._results = getRandom(this.tiles, DRAW_SIZE)
  }

  changeDrawTime() {
    this.fast = !this.fast
    this.drawTime.next(this.fast ? 100 : 1000)
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
