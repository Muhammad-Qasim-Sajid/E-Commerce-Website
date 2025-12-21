import { Menu, Watch } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
              <Watch className="w-6 h-6 text-[#d4af37]" />
            <div>
              <p className="font-['Playfair_Display'] text-xl tracking-tight">GREATNESS</p>
            </div>
          </div>
          
          <button
            onClick={onMenuClick}
            className="p-2 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-[#1a1a1a]" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;