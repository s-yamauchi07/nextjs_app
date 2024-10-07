import { RequestCategoryBody } from "./RequestCategoryBody"
export interface RequestPostBody {
  id: number
  title: string
  content: string
  thumbnailImageKey: string
  postCategories: { category: RequestCategoryBody}[]
}