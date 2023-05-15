'use client';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight } from '../../icons';

export const AppShellLinkItem = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const Comp = Slot;
  return (
    <div className="group mr-auto flex flex-row text-white transition-all hover:text-zinc-300">
      <Comp className="py-2">{children}</Comp>
      <ChevronRight className="relative left-0 my-2 inline-block text-zinc-300 opacity-0 transition-all group-hover:left-2 group-hover:opacity-100" />
    </div>
  );
};
