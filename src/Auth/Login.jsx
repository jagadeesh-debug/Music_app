import { useRef } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { app } from "./firebase";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useStore } from "../zustand/store";
import { useNavigate } from "react-router-dom";
import { AiFillGoogleCircle, AiFillGithub } from "react-icons/ai";

function Login() {
  const auth = getAuth(app);
  const email = useRef();
  const password = useRef();
  const { setIsUser, setDialogOpen } = useStore();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      );
      setDialogOpen(false);
      setIsUser(true);
      navigate("/"); 
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setDialogOpen(false);
      setIsUser(true);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setDialogOpen(false);
      setIsUser(true);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="font-semibold text-xl mt-3">Login to Continue</h1>
      <form onSubmit={handleEmailLogin} className="flex flex-col items-center gap-4 w-full">
        <div className="w-full">
          <Label>Email</Label>
          <Input type="email" ref={email} required />
        </div>
        <div className="w-full">
          <Label>Password</Label>
          <Input type="password" ref={password} required />
        </div>
        <Button type="submit">Login</Button>
      </form>

      <div className="flex gap-4 mt-4">
        <button onClick={handleGoogleLogin} title="Login with Google">
          <AiFillGoogleCircle size={36} />
        </button>
        <button onClick={handleGithubLogin} title="Login with GitHub">
          <AiFillGithub size={36} />
        </button>
      </div>
    </div>
  );
}

export default Login;
