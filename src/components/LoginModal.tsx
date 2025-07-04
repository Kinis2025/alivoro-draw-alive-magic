import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const LoginModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // ⬅️ React Router navigate

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onOpenChange(false); // aizver modal
      navigate("/#upload"); // ⬅️ redirect uz upload sadaļu
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      onOpenChange(false);
      navigate("/#upload"); // ⬅️ redirect uz upload sadaļu
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isRegistering ? "Sign Up" : "Login to Your Account"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? isRegistering
                ? "Signing up..."
                : "Logging in..."
              : isRegistering
              ? "Sign Up"
              : "Login"}
          </Button>
        </form>

        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-purple-600 underline"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="flex items-center justify-center my-2">
          <span className="text-gray-500">or</span>
        </div>

        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? "Processing..." : "Continue with Google"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
