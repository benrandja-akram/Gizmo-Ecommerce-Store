import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/dropdown'
import { getCategories } from '@/db/category'
import { Cart } from '@/ui/cart'
import { Logo } from '@/ui/logo'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { Suspense } from 'react'
import { Search } from '../ui/search'
import { MobileMenu } from './mobile-menu'

async function Header() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-10">
      <nav className="border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 items-center justify-between">
          {/* Logo (lg+) */}
          <div className="hidden space-x-4 lg:flex lg:items-center">
            <Link href="/" className="mr-12">
              <span className="sr-only">Gizmo tech dz</span>
              <Logo />
            </Link>
            {categories.slice(0, 5).map((category) => {
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  type="button"
                  className="flex-1 whitespace-nowrap border-b-2  border-transparent px-1 py-4 text-base font-medium  text-gray-700 transition-all hover:text-gray-900"
                >
                  {category.name}
                </Link>
              )
            })}
            <Dropdown>
              <DropdownButton plain>
                Autres
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu anchor="bottom start">
                {categories.slice(5).map((category) => (
                  <DropdownItem
                    key={category.id}
                    href={`/category/${category.id}`}
                  >
                    {category.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Mobile menu and search (lg-) */}
          <Suspense fallback={<span className="flex-1" />}>
            <MobileMenu categories={categories} />
          </Suspense>
          {/* Logo (lg-) */}
          <Link href="/" className="lg:hidden">
            <span className="sr-only">Your Company</span>
            <Logo />
          </Link>

          <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center space-x-4">
              <Suspense>
                <Search />
                <Cart />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
function TopBanner() {
  return (
    <div className="relative z-20 bg-gray-900">
      <div className=" px-4 py-3.5 sm:px-6 lg:px-8">
        <p className=" text-center text-base font-semibold text-white lg:flex-none">
          Appelez-nous au téléphone 0559 21 74 83
        </p>
      </div>
    </div>
  )
}
export { Header, TopBanner }
