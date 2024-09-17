import Link from "next/link";

const Header: React.FC = () => {
  return(
    <header className="bg-gray-800 p-6 flex justify-between">
      <Link href="/" className="text-white text-bold font-bold">
        Blog
      </Link>
      <Link href="/contact"  className="text-white font-bold">
        お問い合わせ
      </Link>
    </header>
  )
}

export default Header