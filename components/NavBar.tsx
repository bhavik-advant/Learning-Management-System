import { BiSearch } from 'react-icons/bi';
import ThemeButton from './ui/ThemeButton';
import { GiHamburgerMenu } from 'react-icons/gi';

const NavBar: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <nav className=" flex justify-between items-center border-b w-full lg:px-8  p-4 h-18 border-gray-300  gap-4">
      <GiHamburgerMenu className="lg:hidden text-2xl" onClick={onClick} />
      <div className="flex flex-1  items-center ">
        <input
          placeholder="Search.."
          className="max-w-120 flex-1  rounded-l-md  focus:outline-none px-2 py-2  w-full bg-gray-200 dark:bg-gray-700"
        />
        <button className="bg-gray-300 dark:bg-gray-600 p-3 rounded-r-md">
          <BiSearch />
        </button>
      </div>
      <ThemeButton />
    </nav>
  );
};

export default NavBar;
