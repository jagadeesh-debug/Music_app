import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import {Input} from "../components/ui/input"
import { Button } from "../components/ui/button";
import {Label} from "../components/ui/label"
import { useMain } from "../Context";
import app from "./firebase";


function Login () {
const auth = getAuth(app);
const email = useRef()
const password = useRef()
const {setIsUser} = useMain();
const handleSubmit = (e) => {
  e.preventDefault()
try{
signInWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then(() => {
    setIsUser(true)
  })
} catch(error) {

}
}
return (
    <div className=" flex flex-col gap-2 items-center">
        <h1 className=" font-semibold text-xl mt-3">Login to Continue</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
            <div className="w-full">
            <Label>Email</Label>
            <Input type="email"/>
            </div>
            <div className="w-full">
            <Label>Password</Label>
            <Input type="password"/>
            </div>
            <Button type="submit">Submit</Button>
        </form>
    </div>
)
}

export default Login