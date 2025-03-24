// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   useZodForm,
// } from "@/components/ui/form";
// import { updateBeneficiaryOrder } from "@/lib/actions/update-tontine.action";
// import { useState } from "react";
// import { toast } from "sonner";
// import { z } from "zod";

// const BeneficiaryOrderSchema = z.object({
//   tontineId: z.string(),
//   beneficiaryOrder: z.string().array(),
// });

// export function BeneficiaryOrderForm(props: {
//   tontineId: string;
//   members: { id: string; name: string }[];
// }) {
//   const [order, setOrder] = useState(props.members.map((member) => member.id));
//   const form = useZodForm({
//     schema: BeneficiaryOrderSchema,
//     defaultValues: {
//       tontineId: props.tontineId,
//       beneficiaryOrder: order,
//     },
//   });

//   const moveUp = (index: number) => {
//     if (index === 0) return;
//     const newOrder = [...order];
//     [newOrder[index - 1], newOrder[index]] = [
//       newOrder[index],
//       newOrder[index - 1],
//     ];
//     setOrder(newOrder);
//   };

//   const moveDown = (index: number) => {
//     if (index === order.length - 1) return;
//     const newOrder = [...order];
//     [newOrder[index + 1], newOrder[index]] = [
//       newOrder[index],
//       newOrder[index + 1],
//     ];
//     setOrder(newOrder);
//   };

//   const onSubmit = async (data: z.infer<typeof BeneficiaryOrderSchema>) => {
//     const result = await updateBeneficiaryOrder({
//       ...data,
//       beneficiaryOrder: order,
//     });
//     if (result) {
//       toast.success("Ordre des bénéficiaires mis à jour !");
//     } else {
//       toast.error("Erreur lors de la mise à jour de l'ordre des bénéficiaires");
//     }
//   };

//   return (
//     <Form form={form} onSubmit={async (data) => onSubmit(data)}>
//       <FormField
//         control={form.control}
//         name="beneficiaryOrder"
//         render={() => (
//           <FormItem>
//             <FormLabel>Ordre des bénéficiaires</FormLabel>
//             <FormControl>
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Nom
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {order.map((memberId, index) => {
//                     const member = props.members.find((m) => m.id === memberId);
//                     return (
//                       <tr key={memberId}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {member?.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <Button
//                             onClick={() => moveUp(index)}
//                             disabled={index === 0}
//                           >
//                             ↑
//                           </Button>
//                           <Button
//                             onClick={() => moveDown(index)}
//                             disabled={index === order.length - 1}
//                           >
//                             ↓
//                           </Button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <Button type="submit">Mettre à jour</Button>
//     </Form>
//   );
// }

"use client";

import type React from "react";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateBeneficiaryOrder } from "@/lib/actions/update-tontine.action";
import { TontineRole } from "@prisma/client";
import { toast } from "sonner";
import { z } from "zod";

interface Beneficiary {
  id: string;
  name: string;
  role: TontineRole;
}

interface SortableItemProps {
  beneficiary: Beneficiary;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const BeneficiaryOrderSchema = z.object({
  tontineId: z.string(),
  beneficiaryOrder: z.string().array(),
});

const SortableItem = ({
  beneficiary,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: beneficiary.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="hover:bg-muted/50">
      <TableCell className="w-10">
        <div
          className="flex items-center justify-center cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>{beneficiary.name}</TableCell>
      <TableCell>
        {beneficiary.role === TontineRole.ADMIN ? "Administrateur" : "Membre"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-8 w-8"
            aria-label="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-8 w-8"
            aria-label="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export function BeneficiaryOrderForm(props: {
  tontineId: string;
  members: { id: string; name: string; role: string }[];
}) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(
    props.members as Beneficiary[],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBeneficiaries((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= beneficiaries.length) return;
    setBeneficiaries(arrayMove(beneficiaries, fromIndex, toIndex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the ordered beneficiaries to your backend
    const data = beneficiaries.map((b) => b.id);
    const result = await updateBeneficiaryOrder({
      tontineId: props.tontineId,
      beneficiaryOrder: data,
    });
    if (!result) {
      // Handle error
      toast.error("Erreur lors de la mise à jour de l'ordre des bénéficiaires");
    }
    // You could also show a success message
    toast.success("Ordre des bénéficiaires mis à jour !");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Planning de rédistribution</CardTitle>
        <CardDescription>
          Réorganisez l'ordre des bénéficiaires en les faisant glisser ou en
          utilisant les boutons de haut/bas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={beneficiaries.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {beneficiaries.map((beneficiary, index) => (
                    <SortableItem
                      key={beneficiary.id}
                      beneficiary={beneficiary}
                      onMoveUp={() => moveItem(index, index - 1)}
                      onMoveDown={() => moveItem(index, index + 1)}
                      isFirst={index === 0}
                      isLast={index === beneficiaries.length - 1}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              * Réorganisez l'ordre des bénéficiaires en les faisant glisser ou
              en utilisant les boutons de haut/bas
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Annuler</Button>
        <Button type="submit" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
}
