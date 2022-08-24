import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { AppComponent } from "./app.component"

import { FlexLayoutModule } from "@angular/flex-layout"
import { AppRoutingModule } from "./app-routing.module"
import { SharedModule } from "./commons/modules/shared.module"
import { MissingComponent } from "./missing.component"

@NgModule({
  declarations: [AppComponent, MissingComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
