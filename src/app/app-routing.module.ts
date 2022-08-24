import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AppRoutes } from "./commons/global"
import { MissingComponent } from "./missing.component"

const routes: Routes = [
  { path: "", redirectTo: `/${AppRoutes.SETUP}`, pathMatch: "full" },
  {
    path: AppRoutes.SETUP,
    loadChildren: () => import(`./setup`).then((m) => m.SetupModule),
  },
  {
    path: AppRoutes.PLAY,
    loadChildren: () => import("./game/index").then((m) => m.GameModule),
  },
  {
    path: "**",
    component: MissingComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
