export interface RequestBody {
  title: string
  content: string
  thumbnailUrl: string
  categories: { id: number }[]
}
