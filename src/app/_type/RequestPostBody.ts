export interface RequestPostBody {
  title: string
  content: string
  thumbnailUrl: string
  categories: { id: number }[]
}
