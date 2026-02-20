"use client";

import { Checkbox, Label } from '@heroui/react';
import { useSelectedItems } from './selected-items-context';

export default function SelectLineCheckbox({ lineId }: { lineId: string }) {
  const { selectedLineIds, toggleLineId } = useSelectedItems();
  const isChecked = selectedLineIds.includes(lineId);

  return (
    <div className="mr-3 ">
      <Checkbox
        className="[&_[data-slot='checkbox-default-indicator--checkmark']]:size-4"
        name={`select-${lineId}`}
        isSelected={isChecked}
        onChange={() => toggleLineId(lineId)}
      >
        <Checkbox.Control className="size-6 rounded-full before:rounded-full">
          <Checkbox.Indicator className='size-6 bg-accent text-foreground' />
        </Checkbox.Control>
        <Checkbox.Content>
          <Label className="sr-only">Seleccionar</Label>
        </Checkbox.Content>
      </Checkbox>
    </div>
  );
}
