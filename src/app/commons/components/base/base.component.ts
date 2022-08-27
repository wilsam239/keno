import { Component, OnDestroy } from "@angular/core"
import { isObservable, Observable, Subscription } from "rxjs"
import { isSubscription } from "rxjs/internal/Subscription"

@Component({
  selector: "bc",
  template: ``,
})
export class BaseComponent implements OnDestroy {
  private _subs: Subscription[] = []

  sub(...s: (Subscription | Observable<any>)[]) {
    s.forEach((_s) => {
      if (isObservable(_s)) {
        this._subs.push(_s.subscribe())
      } else if (isSubscription(s)) {
        this._subs.push(_s)
      }
    })
  }

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe())
  }
}
