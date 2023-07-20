import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="py-4 px-8 flex justify-end">
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}
