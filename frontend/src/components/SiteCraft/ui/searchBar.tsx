import { Input } from "./input";

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
    return (
        <div className="relative flex-1">
            <img
            src="/icons/search-colored.svg"
            alt="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-70"
            />
            <Input
            id="search"
            name="search"
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            autoComplete="search"
            className="h-10 pl-10 pr-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
        </div>
    )
}