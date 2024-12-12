import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RecipeservicesService } from '../recipeservices.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscoverComponent } from './discover/discover.component';
import { CookbookComponent } from './cookbook/cookbook.component';
import { CreaterecipeComponent } from './createrecipe/createrecipe.component';
import { SinglerecipeviewComponent } from './singlerecipeview/singlerecipeview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutpageComponent } from './logoutpage/logoutpage.component';

@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent,
    CookbookComponent,
    CreaterecipeComponent,
    SinglerecipeviewComponent,
    HomepageComponent,
    ProfileComponent,
    LogoutpageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule
    FormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(), // Correct usage of provideHttpClient
    RecipeservicesService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
