"use client"

import { usePathname } from 'next/navigation'
import Link from "next/link";

const SideBar: React.FC = () => {
  const pathname = usePathname();

  const isSelected = (url: string) => {
    if (pathname === url || pathname.startsWith(url + "/")) {
      return true;
    }
    return false;
  };

  return(
    <div className="bg-gray-200 w-80 h-screen">
      <ul>
        <li className={`p-4 ${isSelected("/admin/posts") ? 'bg-blue-100' : ''} `}>
          <Link href="/admin/posts">記事一覧</Link>
        </li>
        <li className={`p-4 ${isSelected("/admin/categories") ? 'bg-blue-100' : ''} `}>
          <Link href="/admin/categories">カテゴリー一覧</Link>
        </li>
      </ul>
    </div>
  )
}

export default SideBar;
