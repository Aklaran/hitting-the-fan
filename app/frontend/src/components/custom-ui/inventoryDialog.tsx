import { InventoryItem } from '@shared/types/scenario'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export const InventoryDialog = ({
  inventory,
}: {
  inventory: InventoryItem[]
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Inventory</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Inventory</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {inventory.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
