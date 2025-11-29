// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function BuildersPage() {
//   const router = useRouter();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const loggedIn =
//       typeof window !== "undefined" &&
//       localStorage.getItem("walletLoggedIn") === "true";

//     if (!loggedIn) {
//       router.replace("/");
//     } else {
//       setChecking(false);
//     }
//   }, [router]);

//   if (checking) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <main className="p-8">
//       <h1 className="text-3xl font-bold">Builders</h1>
//       <p>Welcome, you are logged in with your Cardano wallet.</p>
//     </main>
//   );
// }

"use client";

export default function BuildersPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Builders</h1>
      <p>This is the main page after login.</p>
    </div>
  );
}
