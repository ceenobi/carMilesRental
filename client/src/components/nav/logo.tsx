import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/" className="w-fit">
      <img src="/logo.svg" alt="logo" />
    </Link>
  );
}
