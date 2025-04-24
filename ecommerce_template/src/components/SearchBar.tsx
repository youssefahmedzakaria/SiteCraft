'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  width?: string;
  searchBarHight?: string;
  searchTextColor?:string;
  backgroundColor?: string;
  placeholder?: string;
  searchIconSize?: number;
}

const SearchBar = ({ 
  width = "w-full",
  searchBarHight = "h-10",
  searchTextColor="text-black",
  backgroundColor = "bg-gray-100",
  placeholder = "Search",
  searchIconSize = 18
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
      className={`${searchTextColor} items-center ${searchBarHight} justify-between gap-1 flex ${backgroundColor} p-2 rounded-md ${width}`} 
      onSubmit={handleSearch}
    >
      <button className="cursor-pointer items-center">
        <Image src="/search.svg" alt="Search" width={searchIconSize} height={searchIconSize} />
      </button>
      <input 
        type="text" 
        name='name' 
        placeholder={placeholder}
        className='flex-1 bg-transparent outline-none items-center' 
      /></form>
  )
}

export default SearchBar