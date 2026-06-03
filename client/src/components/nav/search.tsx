import { Form, useSearchParams, useNavigation, useSubmit } from "react-router";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { Search as LucideSearch, Loader, X } from "lucide-react";

export default function Search({
  id,
  placeholder,
}: {
  id: string;
  placeholder?: string;
}) {
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("query");
  const query = searchParams.get("query") || "";

  const debouncedSubmit = useDebouncedCallback((form: HTMLFormElement) => {
    const isFirstSearch = query === "";
    submit(form, {
      replace: !isFirstSearch,
    });
  }, 500);

  const handleQueryDelete = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    searchParams.delete("query");
    submit(searchParams);
  };

  return (
    <>
      <Form
        className="relative w-full md:max-w-75 bg-SoftWhite/60 py-1.5 px-3.5 rounded-full group border-gray-200  hover:border-DeepOrange transition-all duration-300 outline-none flex items-center ring-1 ring-DeepOrange/20"
        role="search"
        id={id}
        onChange={(event) => {
          debouncedSubmit(event.currentTarget);
        }}
      >
        {searching ? (
          <Loader className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <LucideSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        {query && (
          <X
            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
            onClick={handleQueryDelete}
          />
        )}
        <Input
          placeholder={placeholder}
          name="query"
          aria-label="Search"
          defaultValue={query}
          ref={inputRef}
          className="pl-6 placeholder:text-[14px] border-transparent bg-inherit focus:ring-0 focus:border-none focus:outline-0 focus:ring-offset-0"
          type="search"
        />
      </Form>
    </>
  );
}