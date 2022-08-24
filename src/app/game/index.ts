import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { SharedModule } from "../commons/modules/shared.module"
import { GameComponent } from "./game.component"

const routes: Routes = [
  {
    path: "",
    component: GameComponent,
  },
]
@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [GameComponent],
})
export class GameModule {}
