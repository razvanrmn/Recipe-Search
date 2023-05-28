import React, { useState, useCallback, useMemo } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState)
  }, [])

  const menuClassName = useMemo(
    () => (isMenuOpen ? 'block' : 'hidden'),
    [isMenuOpen]
  )

  return (
    <>
      <nav className="bg-blue-500">
        <div className="container mx-auto p-4 md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-white">Chef Razvan</div>
            <button
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none md:hidden"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 8h14a1 1 0 110 2H5a1 1 0 010-2zm0 5h14a1 1 0 010 2H5a1 1 0 010-2zm0 5h14a1 1 0 010 2H5a1 1 0 010-2z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
                  />
                )}
              </svg>
            </button>
          </div>
          <div
            className={`${menuClassName} mt-4 md:mt-0 md:flex md:items-center`}
          >
            <ul className="space-y-4 md:flex md:space-x-4 md:space-y-0">
              <li key="home">
                <a href="#" className="text-white hover:text-gray-300">
                  Home
                </a>
              </li>
              <li key="about">
                <a href="#" className="text-white hover:text-gray-300">
                  About
                </a>
              </li>
              <li key="services">
                <a href="#" className="text-white hover:text-gray-300">
                  Services
                </a>
              </li>
              <li key="contact">
                <a href="#" className="text-white hover:text-gray-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
