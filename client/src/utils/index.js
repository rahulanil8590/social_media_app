import axios from 'axios'
import { Setpost } from '../redux/PostSlice'

const APP_URL = "http://localhost:8800"

export const API = axios.create({
    baseURL: APP_URL,
    responseType: 'json'
})


export const requestApi = async({url ,  token ,data, method }) =>{
    try {
        const result = await  API(url , {
            method : method || "GET",
            data : data,
            headers :{
                "Content-Type" : "application/json",
                Authorization : token ? `Bearer ${token} ` : " "
            }
        })
        return result?.data
    } catch (error) {
        const err = error.response.data;
        console.log(err);
        return {success : err.success , message: err.message}
    }
}

export const HandleFileUpload = async(uploadFile , resourceType) =>{
    try {
        console.log(uploadFile , "==uploadFile");
        const formData = new FormData()
        formData.append("file" , uploadFile)
        formData.append("upload_preset" , resourceType === "image"? 'ImageUpload' : 'VideoUpload')
         console.log(formData , " newformData");
         console.log(uploadFile.type ,"===type file");
        
        const response = await axios.post(
           `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_COULDINARY_ID}/${resourceType}/upload`, formData
        )

        return response?.data.secure_url;
        
    } catch (error) {
        console.log(error.message,"error ready");
    }
}

export const FetchPosts = async( token ,dispatch  , url , data  ) =>{
    try {
        console.log(token ,"fetch token");
        const res = await requestApi({
            url : url || "/posts",
            token: token,
            method : "POST",
            data : data || {}
        })
        dispatch(Setpost(res?.data))
        return
    } catch (error) {
        console.log(error.message);
    }
}

export const LikePost = async( {token , url } ) =>{
    try {
        const res = await requestApi({
            url : url || "/posts",
            token: token,
            method : "POST",
            
        })
        
        return res
    } catch (error) {
        console.log(error.message);
    }
}

export const DeletePost = async( id ,token ) =>{
    try {
        const res = await requestApi({
            url : "/posts/"+ id,
            token: token,
            method : "DELETE",
            
        })
        
        return;
    } catch (error) {
        console.log(error.message);
    }
}


export const  getUserInfo = async( token , id) =>{
    try {
        const url = id === undefined ? "/users/get-user" : "/users/get-user/"+ id;
        const res = await requestApi({
            url : url ,
            token: token,
            method : "POST",   
        })

        if(res.message === "Authentication failed"){
            localStorage.removeItem("user")
            window.alert("User session expired , login again")
            window.location.replace('/login')
        }
        return res?.user
    } catch (error) {
        console.log(error.message);
    }
}

export const sendFriendRequest = async( token , id ) =>{
    try {
        const res = await requestApi({
            url :'/users/friend-request',
            token: token,
            method : "POST",
            data : {requestTo : id}
            
        })
        
        return;
    } catch (error) {
        console.log(error.message);
    }
}


export const viewProfile = async( id ,token ) =>{
    try {
        const res = await requestApi({
            url :'/users/profile-view',
            token: token,
            method : "POST",
            data : { id}
            
        })
        
        return;
    } catch (error) {
        console.log(error.message);
    }
} 

export const getMessage = async (chatId) =>{
    try {
     
            const res = await requestApi({
                url :`/chat/getMessage/${chatId}`,
                method : "GET",
                
                
            })
            console.log(res, "res in getMessage");
            return res;
    } catch (error) {
        console.log(error.message);
    }
}

 export const UserChats = async (userId) =>{
    try {
        const res = await requestApi({
            url :`/chat/${userId}`,
            method : "GET",
        })
        console.log("user response in chat user", res);
        return res
    } catch (error) {
        
    }
}
export const getSocialLink = async (userId ,token) =>{
    try {
        const res = await requestApi({
            url :`/users//socialmediaLink/${userId}`,
            token : token,
            method : "GET",
        })
        console.log("user response in chat user", res);
        return res
    } catch (error) {
        
    }
}