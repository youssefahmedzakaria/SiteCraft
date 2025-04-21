'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavIconsProps {
  iconSize?: number;
  gap?: string;
  profileDropdown?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const NavIcons = ({ 
  iconSize = 25,
  gap = "gap-4 xl:gap-8",
  profileDropdown = {
    backgroundColor: "bg-gray-100",
    textColor: "text-black"
  }
}: NavIconsProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const isLoggedIn = false
  const router = useRouter()
  
  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push('/login')
    }
    setIsProfileOpen((prev) => !prev)
  }

  return (
    <div className={`flex items-center ${gap} relative`}>
      <Image 
        src="/profile.png" 
        alt="Profile" 
        width={iconSize} 
        height={iconSize} 
        className='cursor-pointer' 
        onClick={handleProfile} 
      />
      {isProfileOpen && (
        <div className={`absolute p-4 rounded-md top-12 left-0 text-sm ${profileDropdown.backgroundColor} ${profileDropdown.textColor}`}>
          <Link href='/profile'>Profile</Link>
          <div className='mt-2 cursor-pointer'>Logout</div>
        </div>
      )}
      <Image src="/notification.png" alt="Notifications" width={iconSize} height={iconSize} className='cursor-pointer' />
      <Image src="/cart.png" alt="Cart" width={iconSize} height={iconSize} className='cursor-pointer' />
      <Image src="/wishlist.png" alt="Wishlist" width={iconSize + 5} height={iconSize + 5} className='cursor-pointer' />
    </div>
  )
}

export default NavIcons