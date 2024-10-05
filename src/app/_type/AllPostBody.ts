import { RequestCategoryBody } from "./RequestCategoryBody";
export interface Post {
  id: number
  title: string
  content: string
  thumbnailUrl: string
  createdAt: string
  postCategories: { category : RequestCategoryBody }[]
}