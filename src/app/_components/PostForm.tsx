import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { MenuProps, getStyles } from "@/utils/categoriesUtils";
import { useTheme } from '@mui/material/styles';
import { useForm, SubmitHandler } from "react-hook-form";
import { RequestPostBody } from "@/app/_type/RequestPostBody";
import { RequestCategoryBody } from '../_type/RequestCategoryBody';

type PostFormProps = {
  onsubmit: SubmitHandler<RequestPostBody>;
  handleChange: (event: SelectChangeEvent<string[]>) => void;
  handleDelete?: () => void;
  categoryName: string[];
  categories: RequestCategoryBody[];
  post?: RequestPostBody;
  isEdit?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({onsubmit, handleChange, handleDelete, categories, categoryName, post, isEdit}) => {
  const { register, handleSubmit } = useForm<RequestPostBody>();
  const theme = useTheme();

  return(
    <div className="p-10 w-full">
      <h2 className="text-xl font-bold mb-6">
        {isEdit? "記事編集" : "記事作成"}
      </h2>

      <form 
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-4">
        <div className="flex flex-col">
          <InputLabel htmlFor="title"
            className="mb-2"
          >
            タイトル
          </InputLabel>
          <OutlinedInput type="text"
            id="title"
            defaultValue={post?.title}
            {...register("title")}
          />
        </div>

        <div className="flex flex-col">
          <InputLabel htmlFor="content"
            className="mb-2"
          >
            内容
          </InputLabel>
          <TextareaAutosize
            minRows={3}
            id="content"
            defaultValue={post?.content}
            className="border border-solid border-gray-300 rounded-md p-2"
            {...register("content")}
          />
        </div>

        <div className="flex flex-col">
          <InputLabel htmlFor="thumbnailUrl"
            className="mb-2"
          >
            サムネイルURL
          </InputLabel>
          <OutlinedInput type="text"
            id="thumbnailUrl"
            defaultValue={post?.thumbnailUrl}
            {...register("thumbnailUrl")}
          />
        </div>

        <div className="flex flex-col">
          <InputLabel htmlFor="categories"
            className="mb-2"
          >
            カテゴリー
          </InputLabel>
          <Select
            multiple 
            id="categories"
            value={categoryName}
            onChange={handleChange}
            MenuProps={MenuProps}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}      
          >
            {categories.map((category) => {
              return(
                <MenuItem 
                  key={category.id}
                  value={category.name}
                  style={getStyles(category, categoryName, theme)}
                  >
                  {category.name}
                </MenuItem>
              )
            })}
          </Select>  
        </div>

        {isEdit ? (
          <div className="flex gap-2">
            <button 
              type="submit"
              className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
            >
              編集  
            </button>
            <button 
              type="button"
              className="bg-red-600 text-white font-bold rounded-lg px-4 py-2"
              onClick={() => handleDelete?.()}
            >
              削除
            </button>
          </div>
        ) : (
          <div>
            <button 
              type="submit"
              className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
            >
              作成
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default PostForm;