import { Component, OnInit } from '@angular/core';
import { RecipeservicesService } from '../../recipeservices.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null; // Initialize user as null

  constructor(private recipeService: RecipeservicesService) {}

  ngOnInit(): void {
    this.loadUserProfile();  // Load user profile data
  }

  // Function to load the user profile from the service
  loadUserProfile(): void {
    this.recipeService.userProfile().subscribe(
      (data) => {
        console.log(data)
        console.log("userprofile", data.user_id)
        this.user = data;
       
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
  login(): void {
    this.recipeService.login();
  }
}
