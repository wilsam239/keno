import { Component, OnDestroy, OnInit } from "@angular/core"
import { NUMBER_OPTIONS } from "../commons/global"

@Component({
  selector: "app-setup",
  templateUrl: "./setup.component.html",
  styleUrls: ["./setup.component.scss"],
})
export class SetupComponent implements OnInit, OnDestroy {
  title = "setup"
  numberOptions = NUMBER_OPTIONS
  numberOfNumbers?: number

  numGames = 1

  ngOnInit() {}

  ngOnDestroy() {}
}
