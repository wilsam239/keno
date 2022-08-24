import { Component, OnDestroy, OnInit } from "@angular/core"
import { Router } from "@angular/router";
import { AppRoutes, NUMBER_OPTIONS } from "../commons/global"

interface SetupModel {
    bet: number | undefined;
    games: number | undefined;
    numbers: number | undefined;
    choices: number[]
}
@Component({
  selector: "app-setup",
  templateUrl: "./setup.component.html",
  styleUrls: ["./setup.component.scss"],
})
export class SetupComponent implements OnInit, OnDestroy {
  title = "setup";
  setupModel: SetupModel = {
    bet: undefined,
    games: undefined,
    numbers: undefined,
    choices: []
  }
  numberOptions = NUMBER_OPTIONS;

  constructor(private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {}

  finalise() {
    Object.entries(this.setupModel).filter(([k, v]) => v !== undefined).forEach(([k, v]) => window.localStorage.setItem(k, v));
    this.router.navigate([AppRoutes.PLAY]);
  }
}
