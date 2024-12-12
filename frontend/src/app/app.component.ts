import { Component, OnInit } from '@angular/core';
import { RecipeservicesService } from '../recipeservices.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private recipeService: RecipeservicesService) {}

  ngOnInit(): void {
    this.recipeService.checkSession()
      .pipe(
        catchError((error) => {
          console.error('Session check error:', error);
          return of({ loggedIn: false });
        })
      )
      .subscribe((response) => {
        console.log('Session check response:', response);
        this.isLoggedIn = response.loggedIn;
      });
  }

  login(): void {
    this.recipeService.login();
  }

  logout(): void {
    this.recipeService.logout()
      .pipe(
        catchError((error) => {
          console.error('Error during logout:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log('Logged out successfully');
        this.isLoggedIn = false;
      });
  }
}
