"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

//TODO: Fix Search

export function Combobox({ displayArray }: { displayArray: any[] }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  if (!displayArray) return <span>No array</span>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? displayArray.find((elt) => elt._id === value)?.name
            : "Select Organization..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Organization..." />
          <CommandEmpty>No Organization found.</CommandEmpty>
          <CommandGroup>
            {displayArray.map((elt) => (
              <Link key={elt._id} href={`/organization/${elt._id}`}>
                <CommandItem
                  value={elt._id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === elt._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {elt.name}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
