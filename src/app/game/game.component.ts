import { Component, OnDestroy, OnInit } from "@angular/core"

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  title = "game"

  ngOnInit() {}

  ngOnDestroy() {}
}
