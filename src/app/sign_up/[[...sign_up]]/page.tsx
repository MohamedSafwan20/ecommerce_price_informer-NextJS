import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex justify-center items-center min-h-screen flex-col container">
      <SignUp />
    </main>
  );
}
