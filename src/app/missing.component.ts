import { Component, OnDestroy, OnInit } from "@angular/core"

@Component({
  selector: "app-missing",
  template: `<p>Not Found</p>
    <p>Try /setup or /play</p>`,
})
export class MissingComponent implements OnInit, OnDestroy {
  title = "missing"

  ngOnInit() {}

  ngOnDestroy() {}
}
