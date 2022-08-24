import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { SharedModule } from "../commons/modules/shared.module"
import { SetupComponent } from "./setup.component"

const routes: Routes = [
  {
    path: "",
    component: SetupComponent
  },
]
@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [SetupComponent],
})
export class SetupModule {}
