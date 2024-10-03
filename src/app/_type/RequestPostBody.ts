import { RequestCategoryBody } from "./RequestCategoryBody"
export interface RequestPostBody {
  id: number
  title: string
  content: string
  thumbnailUrl: string
  createdAt: string
  postCategories: { category: RequestCategoryBody}[]
}
