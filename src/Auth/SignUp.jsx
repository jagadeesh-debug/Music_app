import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRef, useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useStore } from "../zustand/store";
import  {app}  from "./firebase";
import { useNavigate } from "react-router-dom";

const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(requirements).filter(Boolean).length;
  const isValid = Object.values(requirements).every(Boolean);
  
  return { requirements, score, isValid };
};

const getPasswordStrength = (score) => {
  if (score === 0) return { text: '', color: '' };
  if (score <= 2) return { text: 'Weak', color: 'text-red-500' };
  if (score <= 4) return { text: 'Medium', color: 'text-yellow-500' };
  return { text: 'Strong', color: 'text-green-500' };
};

function SignUp() {
  const auth = getAuth(app);
  const email = useRef();
  const password = useRef();
  const confPassword = useRef();
  const { setIsUser , setDialogOpen } = useStore();
  const navigate = useNavigate();
  
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (passwordValue) {
      setPasswordValidation(validatePassword(passwordValue));
    } else {
      setPasswordValidation(null);
    }
  }, [passwordValue]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordValue(value);
    password.current.value = value;
    
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPasswordValue(value);
    confPassword.current.value = value;
    
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = {};

    if (!email.current.value) {
      newErrors.email = 'Email is required';
    }

    const validation = validatePassword(passwordValue);
    if (!validation.isValid) {
      newErrors.password = 'Password does not meet all requirements';
    }

    if (passwordValue !== confirmPasswordValue) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        email.current.value,
        passwordValue
      );
      setDialogOpen(false);
      setIsUser(true);
    } catch (error) {
      setErrors({ submit: error.message });
    }
    
    setIsSubmitting(false);
  };
  const strengthInfo = (passwordValidation && passwordValidation.score !== undefined) ? getPasswordStrength(passwordValidation.score) : { text: '', color: '' };

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="font-semibold text-xl mt-3">Create a new Account</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <Label>Email</Label>
          <Input 
            type="email" 
            ref={email}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="w-full">
          <Label>Password</Label>
          <Input 
            type="password" 
            value={passwordValue}
            onChange={handlePasswordChange}
            className={errors.password ? 'border-red-500' : ''}
            placeholder="Enter a strong password"
          />
          
          {/* Password Strength Indicator */}
          {passwordValue && passwordValidation && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">Strength:</span>
                <span className={`text-sm font-medium ${strengthInfo.color}`}>
                  {strengthInfo.text}
                </span>
                <div className="flex-1 bg-gray-200 h-2 rounded">
                  <div 
                    className={`h-2 rounded transition-all duration-300 ${
                      passwordValidation.score <= 2 ? 'bg-red-500' :
                      passwordValidation.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                  />
                </div>
              </div>
              

              <div className="text-xs space-y-1">
                <div className={passwordValidation.requirements.minLength ? 'text-green-600' : 'text-red-500'}>
                  {passwordValidation.requirements.minLength ? '✓' : '✗'} At least 8 characters
                </div>
                <div className={passwordValidation.requirements.hasUpperCase ? 'text-green-600' : 'text-red-500'}>
                  {passwordValidation.requirements.hasUpperCase ? '✓' : '✗'} One uppercase letter
                </div>
                <div className={passwordValidation.requirements.hasLowerCase ? 'text-green-600' : 'text-red-500'}>
                  {passwordValidation.requirements.hasLowerCase ? '✓' : '✗'} One lowercase letter
                </div>
                <div className={passwordValidation.requirements.hasNumbers ? 'text-green-600' : 'text-red-500'}>
                  {passwordValidation.requirements.hasNumbers ? '✓' : '✗'} One number
                </div>
                <div className={passwordValidation.requirements.hasSpecialChar ? 'text-green-600' : 'text-red-500'}>
                  {passwordValidation.requirements.hasSpecialChar ? '✓' : '✗'} One special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
                </div>
              </div>
            </div>
          )}
          
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        
        <div className="w-full">
          <Label>Confirm Password</Label>
          <Input 
            type="password" 
            value={confirmPasswordValue}
            onChange={handleConfirmPasswordChange}
            className={errors.confirmPassword ? 'border-red-500' : ''}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        
        {errors.submit && (
          <div className="w-full">
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          </div>
        )}
        
        <Button 
          type="submit" 
          disabled={isSubmitting || (passwordValue && (!passwordValidation || !passwordValidation.isValid))}
          className="w-full"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
