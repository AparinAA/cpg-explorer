import { Logo } from './Logo';
import { MaxNodesControl } from './MaxNodesControl';
import { ViewSwitcher } from './ViewSwitcher';

export function Header() {
  return (
    <header className="h-12 flex items-center justify-between px-4 bg-[#161b22] border-b border-[#30363d]">
      <Logo />
      <div className="flex items-center gap-4">
        <MaxNodesControl />
        <ViewSwitcher />
      </div>
    </header>
  );
}
