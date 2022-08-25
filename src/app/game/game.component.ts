import { Component, OnDestroy, OnInit } from "@angular/core"
import {
  BehaviorSubject,
  filter,
  interval,
  isObservable,
  mergeMap,
  Observable,
  repeatWhen,
  Subscription,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
  timer,
} from "rxjs"
import { isSubscription } from "rxjs/internal/Subscription"
import {
  AppRoutes,
  DRAW_SIZE,
  getRandom,
  MASTER_LIST,
  PAYOUTS,
  TIME_BETWEEN_GAMES,
} from "../commons/global"
import { GameService } from "../commons/services/game.service"
import { SetupModel } from "../setup/setup.component"

export interface HistoricalGame {
  gameNo: number
  matches: number
  draw: number[]
  payout: number
  hort: string
}
@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  AppRoutes = AppRoutes
  private _subs: Subscription[] = []
  private drawSub!: Subscription

  gameNumber = 0

  headTiles = MASTER_LIST.slice(0, 40);
  tailTiles = MASTER_LIST.slice(40, 80);
  
  fast = true
  drawTime = new BehaviorSubject(this.fast ? 500 : 1000)
  private _results: number[] = []
  drawn: number[] = []

  private allNumbersDrawn = new BehaviorSubject(false)
  gameFinished = false

  headCount = 0
  tailCount = 0

  secondsTilNext!: string

  config!: SetupModel

  payout = 0

  history: HistoricalGame[] = []

  totalHeadCount = 0
  totalTailCount = 0
  totalEvenCount = 0

  showSummary?: boolean

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
          this.retry()
        })
      )
    )
  }

  initVisualSubs() {
    this.sub(
      this.gs.dialogClosed.pipe(tap(() => (this.showSummary = false))),
      this.gameCompletion(),
      this.drawNumbers()
    )
  }

  private gameCompletion() {
    return this.allNumbersDrawn.pipe(
      filter((b) => b),
      tap(() => {
        this.gameFinished = true
        this.gs.dialogOpened = this.gameNumber == this.config.games

        this.showSummary = this.gs.dialogOpened
      }),
      mergeMap(() =>
        interval(1000).pipe(
          takeUntil(
            timer(TIME_BETWEEN_GAMES).pipe(
              takeWhile(() => this.gameNumber < this.config.games!),
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
    )
  }

  private drawNumbers() {
    return this.drawTime.pipe(
      tap((val) => console.log("Should change interval to " + val)),
      switchMap((val) =>
        interval(val).pipe(
          takeUntil(this.allNumbersDrawn.pipe(filter((b) => b))),
          repeatWhen(() =>
            this.allNumbersDrawn.pipe(filter((b) => b === false))
          )
        )
      ),
      tap((val) => {
        const newTile = this._results.at(this.drawn.length)

        if (newTile) {
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
  }
  retry() {
    this.totalEvenCount = 0
    this.totalHeadCount = 0
    this.totalTailCount = 0
    this.payout = 0
    this.gameNumber = 0

    this._subs.forEach((s) => s.unsubscribe())

    if (this.config.skipVisuals) {
      do {
        this.draw()
      } while (this.gameNumber < this.config.games!)
      const spent = this.config.games! * this.config.bet!
      const sortedGames = this.history.sort((a, b) => b.payout - a.payout)
      console.log("SKIPPED VISUALS")
      console.log("SPENT: " + spent)
      console.log("PAID: " + this.payout)
      console.log("OUTCOME: $" + (this.payout - spent))
      console.log("BEST GAME:")
      console.log(sortedGames[0])
      console.log("SORTED GAMES: ")
      console.log(sortedGames.filter((g) => g.payout > 0))
    } else {
      this.initVisualSubs()
      this.draw()
    }
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
    this._results = getRandom(MASTER_LIST, DRAW_SIZE)
    this.calcResults()
  }

  calcResults() {
    if (this.config.numbers) {
      const matches = this._results.reduce(
        (a, b) => a + (this.config.choices.includes(b) ? 1 : 0),
        0
      )

      const hort = this.horton()
      switch (hort) {
        case "EVENS":
          this.totalEvenCount += 1
          break
        case "HEADS":
          this.totalHeadCount += 1
          break
        case "TAILS":
          this.totalTailCount += 1
          break
        default:
          return
      }
      const payout =
        (PAYOUTS[this.config.numbers!][matches.toString()] ?? 0) *
        (this.config.bet ?? 1)

      const hist: HistoricalGame = {
        gameNo: this.gameNumber,
        payout: payout,
        matches: matches,
        hort: hort,
        draw: this._results,
      }
      console.log(`----- Game ${this.gameNumber} Result -----`)
      console.log(hist)
      this.history.push(hist)
      this.payout += payout
    }
  }

  /**
   * Heads, tails, or evens
   */
  horton(): "HEADS" | "TAILS" | "EVENS" {
    const draw = this._results
    const tailNumbers = draw.filter((n) => n > 40)
    return tailNumbers.length > 10
      ? "TAILS"
      : tailNumbers.length === 10
      ? "EVENS"
      : "HEADS"
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
