import { useState,useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { login } from "../services/auth";
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from "../context/AuthContext";
import { getCurrentUser } from "../services/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const { setToken, setUser } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { 
      email,
      password,
    };

    try {
      const response = await login(data);
      localStorage.setItem('token', response.data.token); 
      const token = response.data.token;
      setToken(token);
      toast.success("Login réussie !");
      const userResponse = await getCurrentUser();
      setUser(userResponse.data);
      // const role = userResponse.data.role;
      const redirectUser = (role) => {
        if (role === "admin") navigate('/admin/dashboard');
        else if (role === "conducteur") navigate('/dashboard');
        else navigate('/offer-ride');
      };
      redirectUser(userResponse.data.role);
      

    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors; 
        // console.log(error.response.data.errors); 
        if (errors.unverified) {
          toast.error(errors.unverified[0]);
          return navigate(`/verify-email?email=${encodeURIComponent(data.email)}`); 
        }
        Object.values(error.response.data.errors).flat().forEach((msg) => {
          toast.error(msg);
        });
      } else {
        toast.error("An error has occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-green-100 opacity-40"></div>
        <div className="absolute bottom-40 -left-20 w-60 h-60 rounded-full bg-green-200 opacity-30"></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-green-300 opacity-20"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden z-10"
      >
        <div className="h-3 bg-gradient-to-r from-green-300 to-green-500"></div>
        <div className="px-8 pt-8 pb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 font-urbanist">Welcome Back</h2>
            <p className="text-gray-500 mt-2 font-urbanist">Glad to see you again!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input 
                label="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <Input 
                label="Password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-green-500 hover:text-green-600 font-urbanist mt-1"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div>
              <Button 
                type="submit" 
                fullWidth 
                loading={loading}
              >
                Sign In
              </Button>
            </div>
          </form>
          
          {/* <div className="relative flex items-center mt-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 font-urbanist">or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          {/* <div className="grid grid-cols-3 gap-3 mt-6">
            <button 
              type="button" 
              className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.033s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.083z" fill="#4285F4"/>
              </svg>
            </button>
            <button 
              type="button" 
              className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-0.732 0-1.325 0.593-1.325 1.325v21.351c0 0.731 0.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12v9.293h6.116c0.73 0 1.323-0.593 1.323-1.325v-21.35c0-0.732-0.593-1.325-1.325-1.325z" fill="#3b5998"/>
              </svg>
            </button>
            <button 
              type="button" 
              className="flex justify-center items-center py-2.5 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M24 4.557c-0.883 0.392-1.832 0.656-2.828 0.775 1.017-0.609 1.798-1.574 2.165-2.724-0.951 0.564-2.005 0.974-3.127 1.195-0.897-0.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-0.205-7.719-2.165-10.148-5.144-1.29 2.213-0.669 5.108 1.523 6.574-0.806-0.026-1.566-0.247-2.229-0.616-0.054 2.281 1.581 4.415 3.949 4.89-0.693 0.188-1.452 0.232-2.224 0.084 0.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646 0.962-0.695 1.797-1.562 2.457-2.549z" fill="#1DA1F2"/>
              </svg>
            </button>
          </div> */}  
          
          <p className="mt-8 text-center text-sm text-gray-500 font-urbanist">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="font-semibold text-green-500 hover:text-green-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;