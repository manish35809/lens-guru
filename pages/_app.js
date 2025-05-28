import Header from "@/components/Header";
import '@/styles/globals.css'; // Adjust path as needed

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}