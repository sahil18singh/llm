import { toast } from "react-hot-toast";
import { setLoading,setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
  } = endpoints

export function sendOtp(email,navigate){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent:true,
            })
            dispatch(setProgress(100))
            console.log("SENDOTP API RESPONSE....",response)

            console.log(response.data.success)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        }
        catch(error){
            console.log("SENDOTP API ERROR.......",error)
            toast.error(error?.response?.data?.message)
            dispatch(setProgress(100))
        }
        dispatch(setLoading(100))
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
              })

              console.log("SIGNUP API RESPONSE.....",response)

              if(!response.data.success){
                throw new Error(response.data.message)
              }
              dispatch(setProgress(100));
              toast.success("SIGNUP Success")
              navigate("/login")

        }
        catch(error){
            dispatch(setProgress(100));
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}



export function login(email,password,navigate){
   // console.log("hi............................")
    return async (dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            
            const response = await apiConnector("POST",LOGIN_API,{
                email,
                password,
            })

            console.log("LOGIN API RESPONSE........",response)
            
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            dispatch(setProgress(100))
            toast.success("Login Successful")
            dispatch(setToken(response.data.token))

            const userImage = response.data?.user?.image
            ? response.data.user.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

            dispatch(setUser({...response.data.user,image:userImage}))
            localStorage.setItem("user",JSON.stringify(response.data.user))
            localStorage.setItem("token",JSON.stringify(response.data.token))
            navigate("/dashboard/my-profile")

        }
        catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error(error.response.data.message)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null))
        dispatch(setUser(null))
        //dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}
