import { Component, Input, OnInit, SimpleChanges } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { tap } from "rxjs"
import { MASTER_LIST } from "../../global"
import { GameService } from "../../services/game.service"
import { BaseComponent } from "../base/base.component"

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
})
export class BoardComponent extends BaseComponent implements OnInit {
  headTiles = MASTER_LIST.slice(0, 40)
  tailTiles = MASTER_LIST.slice(40, 80)

  selectedTiles: number[] = []

  selectionLimit = 0
  @Input()
  setupBoard = false

  constructor(private snack: MatSnackBar, public gs: GameService) {
    super()
  }

  ngOnInit(): void {
    const tiles = document.getElementsByClassName("tile")
    Array.from(tiles).forEach((t) => t.classList.add("selected"))

    this.sub(
      this.gs.setup.pipe(
        tap((config) => {
          if (config.numbers) {
            this.selectionLimit = config.numbers
          }
        })
      ),

      this.gs.usersNumbers.pipe(
        tap((numbers) => {
          const notSelected = MASTER_LIST.filter((n) => !numbers.includes(n))

          notSelected.forEach((n) => {
            const tile = document.getElementById("tile-" + n)
            if (tile && !tile.classList.contains("muted")) {
              tile.classList.add("muted")
            }
          })

          numbers.forEach((n) => {
            const tile = document.getElementById("tile-" + n)
            if (tile && tile.classList.contains("muted")) {
              tile.classList.remove("muted")
            }
          })

          this.selectedTiles = numbers
        })
      )
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    const numbersChanged = changes["allowedNumbers"]
    if (
      numbersChanged &&
      numbersChanged.previousValue > numbersChanged.currentValue
    ) {
      this.resetBoard()
    }
  }

  ngAfterViewInit() {
    if (this.setupBoard) {
      const tiles = [
        ...this.headTiles.map((t) => document.getElementById("tile-" + t)),
        ...this.tailTiles.map((t) => document.getElementById("tile-" + t)),
      ]

      tiles.forEach((t, i) =>
        t?.classList.add("selected", "selected-" + Math.ceil((i + 1) / 10))
      )
    }
  }

  clickTile(t: number) {
    if (this.selectedTiles.length < this.selectionLimit) this.gs.clickTile(t)
    else {
      this.snack.open("You have reached your limit!", "Dismiss", {
        duration: 3000,
      })
    }
  }

  resetBoard() {
    this.gs.usersNumbers.next([])
    // const selected = Array.from(
    //   document.getElementsByClassName("selected")
    // ).filter((t) => !t.classList.contains("muted"))

    // selected.forEach((t) => t.classList.add("muted"))
  }
}
