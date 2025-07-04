import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ALLOWED_EMAILS = [
  "shivaopticians2022@gmail.com",
  "saruparam12346@gmail.com",
  "shivalenshousejdp@gmail.com",
  "manishchoudhary35809@gmail.com",
];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && ALLOWED_EMAILS.includes(firebaseUser.email)) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && router.pathname !== "/unauthorized") {
      router.push("/unauthorized");
    }
  }, [loading, user]);

  if (loading) {
    return <div className="p-10 text-center">Checking access...</div>;
  }

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
