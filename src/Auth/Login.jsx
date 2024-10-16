import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import {Input} from "../components/ui/input"
import { Button } from "../components/ui/button";
import {Label} from "../components/ui/label"
import { useMain } from "../Context";
function Login () {
const auth = getAuth();
const email = useRef()
const password = useRef()
const {setIsUser} = useMain();
const handleSubmit = () => {
try{
signInWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then(() => {
    setIsUser(true)
  })
} catch(error) {

}
}
return (
    <div>
        <h1>Login to acess playlist</h1>
        <form onSubmit={handleSubmit}>
            <Label>Email</Label>
            <Input type="email"/>
            <Label>Password</Label>
            <Input type="password"/>
            <Button type="submit">Submit</Button>
        </form>
    </div>
)
}

export default Login