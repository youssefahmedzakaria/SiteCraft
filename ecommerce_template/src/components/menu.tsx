"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface MenuProps {
  textColor?: string;
  backgroundColor?: string;
  menuItems?: {
    label: string;
    href: string;
  }[];
}

const Menu = ({ 
  textColor = "text-white", 
  backgroundColor = "bg-black",
  menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Cart(1)", href: "/cart" },
    { label: "Login", href: "/login" }
  ]
}: MenuProps) => {
  const [open, setOpen] = useState(false)
  
  return (
    <div className=''>
      <Image 
        src='/menu.png' 
        alt='Menu' 
        width={25} 
        height={25} 
        className='cursor-pointer' 
        onClick={() => setOpen(prev => !prev)} 
      />
      {open && (
        <div className={`absolute ${backgroundColor} ${textColor} left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col gap-8 items-center justify-center text-xl z-10`}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Menu