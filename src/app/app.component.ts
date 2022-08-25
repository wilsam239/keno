import { Component, OnDestroy, OnInit } from "@angular/core"
import { GameService } from "./commons/services/game.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "keno"

  constructor(public gs: GameService) {}
  ngOnInit() {}

  ngOnDestroy() {}
}
