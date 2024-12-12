import * as dotenv from 'dotenv';
import * as path from "node:path";
dotenv.config({ path: path.resolve(__dirname, '.env') });

class googleOauth2 {
  static id: string = process.env.GOOGLE_CLIENT_ID as string;
  static secret: string = process.env.GOOGLE_CLIENT_SECRET as string;
}

export default googleOauth2;