"use client"

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation"

import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type PostForm = {
  title: string
  content: string
  thumbnailUrl: string
  categories:  { id: number }[]
}

type Category = {
  id: string
  name: string
}

function getStyles(category: Category, categoryName: string[], theme: Theme) {
  return {
    fontWeight: categoryName.includes(category.name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const NewPost: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState<string[]>([]);
  const { register, handleSubmit, setValue, reset } = useForm<PostForm>();

  const handleChange = (e: SelectChangeEvent<typeof categoryName>) => {
    const { target: { value },} = e;
    setCategoryName(
      typeof value === "string" ? value.split(",") : value,
    );
  };

  // カテゴリー一覧を取得する
  useEffect(()=> {
    const AllCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        const { categories } = await response.json();
        setCategories(categories)
      } catch(error) {
        console.log(error)
      }
    }
    AllCategories();
  },[]);

  // 記事の新規登録を実装
  const onsubmit: SubmitHandler<PostForm> = async (data) => {
    const postData = {
      ...data,
      categories: categories,
    };
    
    try{
      await fetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      })
      alert("記事を投稿しました")
      router.push("/admin/posts");
    }catch (error) {
      console.log(error)
      alert('記事投稿に失敗しました');
    }
  }

  return(
    <div className="p-10 w-full">
      <h2 className="text-xl font-bold mb-6">
        記事作成
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
            {categories && categories.map((category) => {
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

        <div>
          <button 
            type="submit"
            className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
          >
            作成
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPost;
