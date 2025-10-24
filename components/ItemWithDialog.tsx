import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";


export default function ItemWithDialog({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Open
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-3xl">
            <Image src={imageSrc} alt={title} width={1000} height={800} />
          </DialogContent>
        </Dialog>
      </ItemActions>
    </Item>
  );
}
