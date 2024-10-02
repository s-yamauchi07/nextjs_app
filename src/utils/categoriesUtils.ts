import { Theme } from '@mui/material/styles';
import { PostRequestCategoryBody } from "@/app/_type/PostRequestCategoryBody";

export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function getStyles(category: PostRequestCategoryBody, categoryName: string[], theme: Theme) {
  return {
    fontWeight: categoryName.includes(category.name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
