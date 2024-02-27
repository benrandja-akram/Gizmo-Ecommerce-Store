'use client'

import { Button } from '@/components/button'
import { Drawer } from '@/components/drawer'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'
import { useCart } from '@/hooks/use-cart'
import { useCartProducts } from '@/hooks/use-cart-products'
import { useDialog } from '@/hooks/use-dialog'
import { clsx } from '@/utils/clsx'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Dialog } from '@headlessui/react'
import {
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { Product } from '@prisma/client'
import cookies from 'js-cookie'
import { CheckCheckIcon, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { ProductFallback } from './product-fallback'

function Cart() {
  const cart = useCart()
  const { isOpen, onOpen, onClose } = useDialog('cart')

  const { products, isLoading, ids } = useCartProducts({ enabled: isOpen })

  useEffect(() => {
    useCart.setState((state) => ({
      ...state,
      items: JSON.parse(cookies.get('cart') ?? '[]'),
    }))

    const unsubscribe = useCart.subscribe((state) => {
      cookies.set(
        'cart',
        JSON.stringify(
          state.items.map(({ id, quantity }) => ({ id, quantity })),
        ),
      )
    })

    return unsubscribe
  }, [])

  return (
    <>
      <button
        type="button"
        className={'group relative -m-2 flex items-center p-2'}
        onClick={onOpen}
      >
        <ShoppingBagIcon
          className={clsx(
            'h-6 w-6 flex-shrink-0 ',
            cart.items.length
              ? 'text-green-500 group-hover:text-green-600'
              : 'text-gray-700 group-hover:text-gray-900',
          )}
          aria-hidden="true"
        />
        {!!cart.items.length && (
          <span
            className={
              'fade-in-0 animate-in zoom-in-0 absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white group-hover:bg-green-600'
            }
          >
            {cart.items.length}
          </span>
        )}
      </button>

      <Drawer show={isOpen} onClose={onClose}>
        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Shopping cart
              </Dialog.Title>
              <div className="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="mt-8 divide-y">
                {new Array(ids.length).fill(null).map((_, i) => {
                  return <ProductFallback key={i} />
                })}
              </div>
            ) : products?.length ? (
              <div className="-mx-4 mt-8 sm:-mx-6 ">
                <CartProducts
                  products={cart.items
                    .map((item) => products.find((p) => p.id === item.id)!)
                    .filter(Boolean)
                    .filter((p) => p.id)}
                />
              </div>
            ) : (
              <EmptyCart />
            )}
          </div>

          {!!products?.length && (
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="mb-4 flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>
                  {products.reduce(
                    (acc, current) =>
                      acc +
                      current.price *
                        (cart.items.find((i) => i.id === current.id)
                          ?.quantity ?? 0),
                    0,
                  )}{' '}
                  DA
                </p>
              </div>

              <Link href="/checkout" className="mt-6" onClick={onClose} scroll>
                <Button className={'w-full sm:py-2.5'}>Checkout</Button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </>
  )
}

function EmptyCart() {
  return (
    <div className="mt-8 grid items-center justify-center gap-2 rounded-lg border border-dashed bg-gray-50 p-6 text-sm">
      <h3 className="text-center text-lg font-bold">Cart is empty!!</h3>

      <p className="text-gray-700">
        Get started by adding products into your cart
      </p>
      <Link href="/" className="mx-auto mt-6">
        <Button>
          Browse products <MoveRight className="w-5" />
        </Button>
      </Link>
    </div>
  )
}
function CartProducts({ products }: { products: Product[] }) {
  const cart = useCart()
  const [ref] = useAutoAnimate()

  return (
    <ul ref={ref} role="list" className="divide-y divide-gray-200">
      {products
        .map((p) => ({
          ...p,
          quantity: cart.items.find((i) => i.id === p.id)?.quantity,
        }))
        .map((product) => (
          <li
            key={product.id}
            className="animate-in fade-in-0 flex px-4 py-6 sm:px-6"
          >
            <div className="flex-shrink-0">
              <img src={product.image} alt={''} className="w-20 rounded-md" />
            </div>

            <div className="ml-6 flex flex-1 flex-col">
              <div className="flex">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm">
                    <Link
                      href={`/product/${product.id}`}
                      className="font-medium text-gray-700 hover:text-gray-800"
                    >
                      {product.name}
                    </Link>
                  </h4>
                </div>

                <div className="ml-4 flow-root flex-shrink-0">
                  <button
                    onClick={() => cart.removeItem(product.id)}
                    type="button"
                    className="-m-2.5  flex items-center justify-center bg-white p-2.5 text-gray-600 hover:text-red-500"
                  >
                    <span className="sr-only">Remove</span>
                    <TrashIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 items-end justify-between pt-2">
                <p className="mt-1 text-sm font-bold tabular-nums text-gray-900">
                  {product.price}DA
                </p>

                <div className="">
                  <div className="ml-4 min-w-[70px]">
                    <Listbox
                      defaultValue={product.quantity ?? 1}
                      onChange={(value) =>
                        cart.updateQuantity(product.id, value)
                      }
                    >
                      {new Array(4).fill(0).map((_, i) => {
                        return (
                          <ListboxOption key={i} value={i + 1}>
                            <ListboxLabel>{i + 1}</ListboxLabel>
                          </ListboxOption>
                        )
                      })}
                    </Listbox>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
    </ul>
  )
}

function AddToCart({
  product,
  size = 'base',
}: {
  product: number
  size?: 'sm' | 'base'
}) {
  const cart = useCart()

  const selected = cart.items.some((item) => item.id === product)
  return (
    <Button
      color={selected ? 'green' : 'dark/white'}
      onClick={() => {
        if (!selected) cart.addItem({ id: product, quantity: 1 })
        else cart.removeItem(product)
      }}
      className={clsx(
        'w-full truncate',
        size === 'base'
          ? 'sm:px-3 sm:py-3'
          : 'px-1 py-1.5 text-xs sm:px-2 sm:py-2 sm:text-sm/6',
      )}
    >
      {!selected ? (
        <>
          <ShoppingBagIcon className="xs:w-5 !w-4" />
          Ajouter au panier
        </>
      ) : (
        <>
          <CheckCheckIcon className="fade-in-0 animate-in zoom-in-0 slide-in-from-bottom-4 xs:w-5 w-4" />
          En panier
        </>
      )}
    </Button>
  )
}

export { AddToCart, Cart, CartProducts, EmptyCart }
