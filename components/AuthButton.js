import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "@/firebase/config";

const ALLOWED_EMAILS = [
  "shivaopticians2022@gmail.com",
  "saruparam12346@gmail.com",
  "shivalenshousejdp@gmail.com",
  "manishchoudhary35809@gmail.com",
];

export default function AuthButton({ user, setUser }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!ALLOWED_EMAILS.includes(email)) {
        alert("Access denied. Not an authorized Gmail.");
        await signOut(auth);
      } else {
        setUser(result.user);
      }
    } catch (err) {
      console.error("Login error", err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <button
      onClick={user ? handleLogout : handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {user ? "Logout" : "Login with Google"}
    </button>
  );
}
