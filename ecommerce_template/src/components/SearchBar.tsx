'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  width?: string;
  backgroundColor?: string;
  placeholder?: string;
  searchIconSize?: number;
}

const SearchBar = ({ 
  width = "w-full",
  backgroundColor = "bg-gray-100",
  placeholder = "Search",
  searchIconSize = 15
}: SearchBarProps) => {
  const router = useRouter()
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    if (name) {
      router.push(`/list?name=${name}`)
    }
  }

  return (
    <form 
      className={`flex items-center justify-between gap-4 ${backgroundColor} p-2 rounded-md ${width}`} 
      onSubmit={handleSearch}
    >
      <input 
        type="text" 
        name='name' 
        placeholder={placeholder}
        className='flex-1 bg-transparent outline-none' 
      />
      <button className="cursor-pointer">
        <Image src="/search.png" alt="Search" width={searchIconSize} height={searchIconSize} />
      </button>
    </form>
  )
}

export default SearchBar