import { RequestCategoryBody } from "./RequestCategoryBody";
export interface Post {
  id: number
  title: string
  content: string
  thumbnailImageKey: string
  createdAt: string
  postCategories: { category : RequestCategoryBody }[]
}