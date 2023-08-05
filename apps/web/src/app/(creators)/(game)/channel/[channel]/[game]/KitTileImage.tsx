import { download } from '@kittr/firebase/storage';
import type {
  WarzoneKit,
  WarzoneKitBase,
  WarzoneTwoKit,
  WarzoneTwoKitBase,
} from '@kittr/prisma';

interface Kit extends WarzoneKit, WarzoneTwoKit {
  base: WarzoneKitBase | WarzoneTwoKitBase;
}

export async function KitTileImage({ kit }: { kit: Kit }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={kit.base.displayName}
      className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 opacity-25 rotate-12 grayscale top-1/2 left-1/2"
      height={250}
      src={await download(kit.base.imageUrl)}
      width={250}
    />
  );
}
