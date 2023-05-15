import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib";
import { Button } from "./Button";
import { Calendar, CalendarProps } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

type Props = {
  mode?: "single" | "multiple" | "range";
  onSelect?: (date?: Date) => void;
  defaultValue?: Date;
  error?: string;
} & CalendarProps;

export function DatePicker({
  onSelect,
  defaultValue,
  selected,
  error,
  ...rest
}: Props) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);

  function onSelectHandler(date?: Date) {
    setDate(date);
    if (!date) return;
    onSelect && onSelect(date);
  }

  React.useEffect(() => {
    if (selected) {
      setDate(selected as Date);
    }
  }, [selected, setDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start bg-card text-left font-normal",
            { "border-red-500": error },
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...rest}
          mode={"single"}
          selected={date}
          onSelect={onSelectHandler}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
