import { useForm, SubmitHandler } from "react-hook-form";
import { PostRequestCategoryBody } from "../_type/PostRequestCategoryBody";

type CategoryFormProps = {
  onsubmit: SubmitHandler<PostRequestCategoryBody>;
  handleDelete?: () => void;
  isEdit?: boolean;
  category? : PostRequestCategoryBody;
}

const CategoryForm: React.FC<CategoryFormProps> = ({onsubmit, handleDelete, isEdit, category}) => {
  const { register, handleSubmit } = useForm<PostRequestCategoryBody>();
    
  return(
    <div className="p-10 w-full">
      <h2 className="text-xl font-bold mb-6">
        {isEdit ? "カテゴリー編集" : "カテゴリー作成"}
      </h2>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-4"
      >
        <label htmlFor="name">カテゴリー</label>
        <input type="type"
          id="name"
          defaultValue={category?.name}
          className="border border-solid border-gray-200 rounded-lg p-2"
          {...register("name")}
        />
        {isEdit ? (
            <div className="flex gap-2">
              <button 
                type="submit"
                className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
              >
                更新
              </button>
              <button 
                type="button"
                className="bg-red-600 text-white font-bold rounded-lg px-4 py-2"
                onClick={() => handleDelete?.()}
              >
                削除
              </button>
            </div>
          ): (
            <div>
              <button 
                type="submit"
                className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
              >
                作成
              </button>
            </div>
          )
        }
      </form>
    </div>
  )
}
export default CategoryForm;