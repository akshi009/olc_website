"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuCheckboxes({
    options,
    heading,
    selected,
    onChange,
}: {
    options: string[];
    heading: string;
    selected: string[];
    onChange: (selected: string[]) => void;
}) {
    const toggle = (item: string, checked: boolean) => {
        if (checked) onChange([...selected, item]);
        else onChange(selected.filter(s => s !== item));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {selected.length > 0 ? `${heading} (${selected.length})` : heading}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" style={{ zIndex: 9999 }}>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{heading}</DropdownMenuLabel>
                    {options.map((item) => (
                        <DropdownMenuCheckboxItem
                            key={item}
                            checked={selected.includes(item)}
                            onCheckedChange={(val) => toggle(item, val)}
                        >
                            {item}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}