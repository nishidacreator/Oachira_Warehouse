import { Category } from "./category";

export interface SubCategory {
  id: number;
  subCategoryName: string;
  categoryId: number;
  status: boolean;

  cloudinaryIdSub : string;
  fileUrlSub : string;

  category: Category;
}
