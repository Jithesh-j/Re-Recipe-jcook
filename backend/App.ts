import * as express from "express";
import * as bodyParser from "body-parser"; // For parsing URL requests and JSON
import { RecipeModel } from "./model/RecipeModel";
import { DiscoverModel } from "./model/DiscoverModel";
import { CookbookModel } from "./model/CookbookModel";
import { UserModel } from "./model/UserModel"; // Import the UserModel
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as passport from "passport";
import GooglePassportObj from "./GooglePassport";

declare global {
  namespace Express {
    interface User {
      id: string;
      displayName: string;
    }
  }
}
// TODO: make a data access file
//import {DataAccess} from './DataAccess';

/**
 * The main application class that sets up the Express server,
 * middleware, routes, and database models.
 */
class App {
  public expressApp: express.Application;
  public RecipeList: RecipeModel;
  public Cookbook: CookbookModel;
  public DiscoverModel: DiscoverModel;
  public UserModel: UserModel;
  public googlePassportObj: GooglePassportObj;

  /**
   * Creates an instance of the App.
   *
   * @param {string} mongoDBConnection - The MongoDB connection string.
   */
  constructor(mongoDBConnection: string) {
    this.googlePassportObj = new GooglePassportObj();
    this.expressApp = express();
    this.DiscoverModel = new DiscoverModel(mongoDBConnection);
    this.Cookbook = new CookbookModel(mongoDBConnection, DiscoverModel);
    this.UserModel = new UserModel(mongoDBConnection); // Initialize UserModel
    this.middleware();
    this.routes();
  }
  private validateAuth(req, res, next): void {
    if (req.isAuthenticated()) {
      console.log("User is authenticated");
      return next();
    }

    console.log("User is not authenticated");
    res.status(401).json({ error: "Unauthorized" });
  }

  /**
   * Sets up middleware for the Express application, including
   * body parsing and CORS headers.
   */
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.header("Access-Control-Allow-Credentials", "true"); // Allow cookies
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      }
    );

    // Body parsing middleware
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));

    // Session and cookie parsing middleware
    this.expressApp.use(
      session({
        secret: "1234567890QWERTY",
        resave: false,
        saveUninitialized: true,
      })
    );
    this.expressApp.use(cookieParser());

    // Passport initialization
    this.expressApp.use(passport.initialize());
    this.expressApp.use(passport.session());
  }

  /**
   * Defines the routes/endpoints for the application and associates
   * them with their respective handlers.
   */
  private routes(): void {
    const router = express.Router();

    /**
     * ========================
     * SECTION: DISCOVER ROUTES
     * ========================
     */

    // Retrieve all recipes in the Discover collection
    router.get(
      "/app/discover",
      async (req: express.Request, res: express.Response): Promise<void> => {
        await this.DiscoverModel.retrieveAllRecipes(res);
      }
    );

    // Retrieve a specific recipe from the Discover collection by recipeID
    router.get(
      "/app/discover/:recipeID",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const recipeID: string = req.params.recipeID;
        await this.DiscoverModel.retrieveRecipe(res, recipeID);
      }
    );

    // Add a new recipe to the Discover collection
    router.post(
      "/app/discover",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const newRecipeData = req.body;
        await this.DiscoverModel.createRecipe(res, newRecipeData);
      }
    );

    // Delete a recipe from the Discover collection by recipeID
    router.delete(
      "/app/discover/:recipeID",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const recipeID: string = req.params.recipeID;
        await this.DiscoverModel.deleteRecipe(res, recipeID);
      }
    );

    /**
     * ========================
     * SECTION: COOKBOOK ROUTES
     * ========================
     */

    // Retrieve all recipes in a user's cookbook
    router.get("/app/cookbook", this.validateAuth, async (req, res) => {
      try {
        // Extract user_ID from req.user
        const userId = req.user?.id;
        console.log("user id in GET Cookbook.......",userId)
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }
         
        // Get cookbook recipes 
        const recipes = await this.Cookbook.getAllCookbookRecipes(userId);
        res.json(recipes);
      } catch (error) {
        console.error("Error getting cookbook:", error);
        res
          .status(500)
          .json({ error: "An error occurred while retrieving the cookbook." });
      }
    });

    // Remove a specific recipe from a user's cookbook
    router.delete(
      "/app/cookbook/:userId/recipes/:recipeId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        const recipeId: string = req.params.recipeId;
        await this.Cookbook.removeRecipeFromCookbook(res, userId, recipeId);
      }
    );

    // Add a new recipe in a user's cookbook
    // router.post(
    //   "/app/cookbook/:userId/recipes/:recipeId",
    //   async (req: express.Request, res: express.Response): Promise<void> => {
    //     const userId: string = req.params.userId;
    //     const recipeId: string = req.params.recipeId;
    //     await this.Cookbook.copyRecipeFromDiscover(res, recipeId, userId);
    //   }
    // );
    router.post(
      "/app/cookbook",
      this.validateAuth,
      async (req, res) => {
        console.log("Here in app cookbook route");
        try {
          const { recipeIds } = req.body;
          console.log("recipe ids", recipeIds)
          const userId = req.user?.id;
          console.log("cookbook route userid.......", userId);
    
          // Validate input
          if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
            return res.status(400).json({ error: "Invalid recipe IDs" });
          }
    
          if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
          }
    
          await this.Cookbook.copyRecipesFromDiscover(res, recipeIds, userId);
        } catch (error) {
          console.error("Error in /app/cookbook:", error);
          res.status(500).json({ error: "Failed to copy recipes from Discover" });
        }
      }
    );
    
    

    /**
     * ====================
     * SECTION: USER ROUTES
     * ====================
     */
    router.get(
      "/app/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/" }),
      async (req, res) => {
        // Create a user profile if one doesn't exist
        const googleUser = req.user;
        const user = await this.UserModel.findOrCreateUser(googleUser);

        console.log("User successfully authenticated");
        console.log("Session User:", req.user);
        console.log("user info:" + JSON.stringify(req.user));
        console.log("user id:" + JSON.stringify(req.user.id));
        console.log("user displayName:" + JSON.stringify(req.user.displayName));
        res.redirect("http://localhost:4200/discover");
      }
    );
    router.get("/app/auth/check", (req, res) => {
      if (this.validateAuth) {

        console.log("User is authenticated: in check");
        return res.json({ loggedIn: true });
      }
      console.log("User is not authenticated");
      res.json({ loggedIn: false });
    });

    // Get the user profile
    router.get("/app/profile", this.validateAuth, async (req, res) => {
      try {
        // Extract user_ID from req.user
       
        const userId = req.user?.id;
        console.log("app.ts user profile......", userId)
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        // Call the getUserProfile method from the UserModel
        await this.UserModel.getUserProfile(res, userId);
      } catch (error) {
        console.error("Error retrieving profile:", error);
        res
          .status(500)
          .json({ error: "An error occurred while retrieving the profile." });
      }
    });

    // Google SSO Sign - In
    router.get(
      "/app/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    router.get("/app/auth/info", this.validateAuth, (req, res) => {
      console.log("Query All list");
      console.log("user info:" + JSON.stringify(req.user));
      console.log("user id:" + JSON.stringify(req.user.id));
      console.log("user displayName:" + JSON.stringify(req.user.displayName));
      res.json({ username: req.user.displayName, id: req.user.id });
    });

    // Logs the user out
    router.get("/app/logout", (req, res) => {
      // Logs the user out using Passport's logout method
      req.logout((err) => {
        if (err) {
          console.error("Error during logout:", err);
          return res.status(500).json({ error: "Logout failed" });
        }

        // Destroy the sesh on the server
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            return res
              .status(500)
              .json({ error: "Session destruction failed" });
          }

          // Clear the session cookie from the client's browser
          res.clearCookie("connect.sid"); // Ensure this matches your session cookie name
          console.log("User successfully logged out");
          res.json({ message: "Logged out successfully" });
        });
      });
    });

    // Update a user's profile information
    router.put(
      "/app/user/profile/:userId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        const updateData = req.body;
        await this.UserModel.updateUser(res, userId, updateData);
      }
    );

    // Delete a user's profile by userId
    router.delete(
      "/app/user/profile/:userId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        await this.UserModel.deleteUser(res, userId);
      }
    );

    // Mount the router on the Express application
    this.expressApp.use("/", router);
    this.expressApp.use("/app/json/", express.static(`${__dirname}/app/json`));
    this.expressApp.use("/images", express.static(`${__dirname}/img`));

    //The static end point for angular and fallback
    // Updated for root
    this.expressApp.use("/", express.static(`${__dirname}/recipes/browser`));

    this.expressApp.get(
      "*",
      (req: express.Request, res: express.Response): void => {
        res.sendFile(`${__dirname}/recipes/browser/index.html`);
      }
    );
  }
}
export { App };