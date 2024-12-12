import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeservicesService } from '../../recipeservices.service';

@Component({
  selector: 'app-singlerecipeview',
  templateUrl: './singlerecipeview.component.html',
  styleUrls: ['./singlerecipeview.component.css']
})
export class SinglerecipeviewComponent implements OnInit {
  recipe: any; // If possible, replace `any` with a proper interface type.

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeservicesService
  ) {}

  ngOnInit(): void {
    const recipeID = this.route.snapshot.paramMap.get('recipeID');
    if (recipeID) {
      this.recipeService.getRecipeContentByID(recipeID).subscribe(
        (data) => {
          this.recipe = data;
          console.log('Fetched recipe:', this.recipe);
        },
        (error) => console.error('Error fetching recipe', error)
      );
    }
  }
}
