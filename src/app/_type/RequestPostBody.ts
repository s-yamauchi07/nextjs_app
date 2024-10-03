import { RequestCategoryBody } from "./RequestCategoryBody"
export interface RequestPostBody {
  id: number
  title: string
  content: string
  thumbnailUrl: string
  postCategories: { category: RequestCategoryBody}[]
}