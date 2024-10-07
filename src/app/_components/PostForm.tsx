import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { MenuProps, getStyles } from "@/utils/categoriesUtils";
import { useTheme } from '@mui/material/styles';
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form";
import { RequestPostBody } from "@/app/_type/RequestPostBody";
import { RequestCategoryBody } from '../_type/RequestCategoryBody';
import useSupabaseSession from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image'

type PostFormProps = {
  handleDelete?: () => void;
  post?: RequestPostBody;
  isEdit?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({handleDelete, post, isEdit}) => {
  const { register, handleSubmit } = useForm<RequestPostBody>();
  const theme = useTheme();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const [categories, setCategories] = useState<RequestCategoryBody[]>([]);
  const [categoryName, setCategoryName] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<RequestCategoryBody[]>([]);
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null,)

  
  useEffect(() => {
    if (!token) return;
    const fetchCategory = async () => {
      // 全カテゴリーを取得する
      const allCategories = await fetch("/api/admin/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      })
      const categoryData = await allCategories.json();
      setCategories(categoryData.categories)

      if(post && post.thumbnailImageKey) {
        // カテゴリーのオブジェクトを取得
        const categoryLists = post.postCategories.map((c) => c.category);
  
        // カテゴリ名のリストをカテゴリーの初期値に設定
        const categoryNames = categoryLists.map((c: RequestCategoryBody) => c.name);
        setCategoryName(categoryNames);
        setThumbnailImageKey(post.thumbnailImageKey);
      }
    }
    fetchCategory();
  },[token, post])

  // 画像取得のための処理
  useEffect(()=> {
    if (!thumbnailImageKey) return

    const fetcher = async () => {
      const { data : { publicUrl}, } = await supabase.storage.from('post_thumbnail').getPublicUrl(thumbnailImageKey);
      setThumbnailImageUrl(publicUrl)
    };

    fetcher();
  },[thumbnailImageKey]);

  const handleChange = (e: SelectChangeEvent<typeof categoryName>) => {
    const { target: { value },} = e;
    const selectedCategoryNames = typeof value === "string" ? value.split(",") : value;
    setCategoryName(selectedCategoryNames);

    // 選択されたカテゴリー名に基づいて、selectedCategoriesを更新
    const updatedSelectedCategories = categories.filter((category) => 
      selectedCategoryNames.includes(category.name)
    );
    setSelectedCategories(updatedSelectedCategories);
  };

  //記事投稿
  const onsubmit: SubmitHandler<RequestPostBody> = async (data) => {
    if (!token) return
    
    const updateData = {
      ...data,
      thumbnailImageKey: thumbnailImageKey || post?.thumbnailImageKey,
      categories: selectedCategories,
    };
    
    try {
      const response = await fetch(`/api/admin/posts/${isEdit ? `${post?.id}` : ""}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(updateData),
      });
      if(response.ok) {
        router.push("/admin/posts")
        alert(isEdit ? '記事を更新しました' : '記事を更新しました');
      }
    } catch(error) {
      console.log(error);
      alert(isEdit ? '更新に失敗しました' : '登録に失敗しました');
    }
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return
    }

    const file = event.target.files[0]
    const filePath = `private/${uuidv4()}`
    const { data, error } = await supabase.storage.from('post_thumbnail').upload(filePath, file, { cacheControl: '3600', upsert: false, })
    
    if (error) {
      alert(error.message)
      return
    }
    setThumbnailImageKey(data.path)
  }

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
          <InputLabel htmlFor="thumbnailImageKey"
            className="mb-2"
          >
            サムネイルURL
          </InputLabel>
          <input type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
          />
          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image 
                src={thumbnailImageUrl} 
                alt="thumbnail"
                width={400}
                height={400}
              />
            </div>
          )}
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