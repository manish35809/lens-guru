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
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
