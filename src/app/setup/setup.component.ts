import { Component, OnDestroy, OnInit } from "@angular/core"

@Component({
  selector: "app-setup",
  templateUrl: "./setup.component.html",
  styleUrls: ["./setup.component.scss"],
})
export class SetupComponent implements OnInit, OnDestroy {
  title = "setup"

  ngOnInit() {}

  ngOnDestroy() {}
}
