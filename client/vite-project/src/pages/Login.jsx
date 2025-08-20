import React, {useContext, useState} from 'react';
import { assets } from '../assets/assets';
import Aurora from '../Aurora.jsx';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios'; 
import { toast } from 'react-toastify';
const Login = () => {
  const navigate = useNavigate()

  const {backendUrl,setIsLoggedIn,getUserData} = useContext(AppContext)
  const [state, setState] = useState('Sign Up');
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const onSubmitHandler = async(e)=> {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true //for sending cookies
      
      if(state==='Sign Up'){
        const {data} = await axios.post(backendUrl + '/api/auth/register',{name,email,password})
        if(data.success){
          setIsLoggedIn(true);
          getUserData()
          navigate('/');
        }else{
          toast.error(data.message)
        }
      }else{
         const {data} = await axios.post(backendUrl + '/api/auth/login',{email,password})
        if(data.success){
          setIsLoggedIn(true);
          getUserData()
          navigate('/');
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black">

      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          className="w-full h-full"
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Centered Form */}
      <div className="z-10 w-full sm:w-96 bg-slate-900 p-10 rounded-lg shadow-lg text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === 'Sign Up' ? 'Create Your Account' : 'Login to Your Account!'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" className="w-4 h-4" />
              <input
              onChange={(e) => setName(e.target.value)}
                type="text"
                className="bg-transparent outline-none text-white w-full"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.email_icon} alt="" className="w-4 h-4" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-transparent outline-none text-white w-full"
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.password_icon} alt="" className="w-4 h-4" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="bg-transparent outline-none text-white w-full"
              placeholder="Enter Password"
              required
            />
          </div>
          <p onClick={() => (navigate('/reset-password'))} className="mb-4 text-indigo-500 cursor-pointer text-right text-sm">Forgot password?</p>
          <button type='submit' className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already Have An Account?{' '}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => setState('Login')}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't Have An Account?{' '}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => setState('Sign Up')}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
