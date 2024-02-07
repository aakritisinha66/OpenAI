import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { ImageGenerationComponent } from './image-generation/image-generation.component';
import { CodeGenerationComponent } from './code-generation/code-generation.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'code-generation', component: CodeGenerationComponent},
  { path: 'image-generation', component: ImageGenerationComponent},
  { path: '', component: LoginComponent}
];

@NgModule({
  imports: [BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
