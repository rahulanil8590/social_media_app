//Hooks
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
//Ends
//Components
import { Topbar , ProfileCard, FriendsCard, CustomButton, Textinputs, Loading ,PostCard, EditProfile } from '../Component'
import { friends ,requests , suggest  } from '../Assets/Data'
import { Link } from 'react-router-dom'
import { Noprofile } from '../Assets'
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs'
import { BiGift, BiImage, BiVideo } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import { UpdateProfile, login } from '../redux/UserSlice'
import { DeletePost, FetchPosts, HandleFileUpload, LikePost, getUserInfo, requestApi, sendFriendRequest, viewProfile } from '../utils'
import { SetChat } from '../redux/ChatsSlice'
//Ends
function Home() {
  const {user ,edit} =  useSelector((state) => state.user)
  const{posts} = useSelector((state) => state.posts)
  const{chat} = useSelector((state) => state.chat)
  const[friendsRequest , SetFriendsRequest] = useState([])
  const[SuggestedRequest , SetSuggestedRequest] = useState([])
  const[ErrMsg ,setErrMsg] = useState("")
  const[File , setFile] =useState(null)
  const[resourceType , setresourceType] = useState('')
  const[post , Setposts] = useState(false)
  const[loading , SetLoading]= useState(false)
  const dispatch =useDispatch()
  const{register, handleSubmit , reset, formState:{errors}} = useForm({
    mode: 'onChange'
    })
    console.log("usertoken", user);
    const HandlePostSubmit = async(data) =>{
      Setposts(true)
      setErrMsg("")
      try {
       const url = File && (await HandleFileUpload(File ,resourceType) ) 
       console.log(url , " url");
       console.log(resourceType, "resource data");
      
       const newData = resourceType === 'image' ?  (url ? {...data , image : url} : data) :  (url ? {...data , video : url} : data)
        console.log(newData ,"this is new data %%%%%%%%");
       const res = await requestApi({
        url : "/posts/create-post",
        data : newData,
        token: user?.token,
        method : "POST"
       })
       if(res?.status === 'failied'){
        setErrMsg(res)
       }else{
        reset({
          description : ""
        })
        setFile(null)
        setErrMsg("")
        await fetchPost()
       }
       Setposts(false)
        
      } catch (error) {
        console.log(error);
        Setposts(false)
      }
    }
 
   
    //Fetch the All Post to the server Side
   const  fetchPost = async() =>{
    console.log("usertoken", user?.token);
        SetLoading(false)
        await FetchPosts(user?.token , dispatch)
   }
   //fetch the friends request to server side 
    const fetchFriendRequest = async() => {
      try {
        const res = await requestApi({
          url : "/users/get-friend-request",
          token: user?.token,
          method : "POST"
         })
        SetFriendsRequest(res?.data)
      } catch (error) {
        console.log(error);
      }
    }
    //Fetch suggest to the server side
    const fetchSuggestFriends = async() =>{
      try {
        const res = await requestApi({
          url : "/users/suggested-friend",
          token: user?.token,
          method : "POST"
         })
         SetSuggestedRequest(res?.data)
      } catch (error) {
        console.log(error);
      }
    }
    //Freind requested 
    const handleFriendsRequest = async (id) => {
      try {
         const res = await sendFriendRequest(user?.token , id)
         await fetchFriendRequest()
      } catch (error) {
        console.log(error);
      }
    }
    //Accepted the friends Request
    const AcceptedFriends = async (id , status) =>{
      try {
        const res = await requestApi({
          url : "/users/accept-request",
          token: user?.token,
          data : {rid : id ,status},
          method : "POST"
         })
         console.log(res, "accept friends request");
        //chat create the friend and user conversation setup
              const newData = {senderId : user?._id , recieverId : id}
              const Chatres = await requestApi({
                  url :`/chat/`,
                  method : "POST",
                  data : newData
                  
              })
              
              const newChat = {chat : Chatres?._id , ...Chatres}
          dispatch(SetChat(Chatres))
           
      } catch (error) {
        console.log(error);
      }
    }
    
    //LIkes the Post 
    const handlelikePost = async (url) => {
      const data = {url : url , token : user?.token}
      await LikePost(data)

      await fetchPost()
    }
    //Delete the post 
    const handleDeletePost = async (id) => {
      await DeletePost(id , user?.token)

      await fetchPost()
    }
    //fetch the users
   const getUser = async() =>{
    try {
      const res = await getUserInfo(user?.token)
      console.log(res, "===res 0f user");
      const newData = {token : user?.token , ...res}
      dispatch(login(newData))
    } catch (error) {
      console.log(error);
    }
   }

// UseEefect Loading the Post and utils Functions
    useEffect(() =>{
      console.log(posts, "posts");
      SetLoading(true)
      getUser()
      getUserInfo()
      fetchPost()
      fetchFriendRequest()
      fetchSuggestFriends()
    },[])
   
  return (
    <>
    <div className='home w-full px-0 md:px-4 pb-20 2xl:px-10 h-screen rounded-lg bg-bgColor'>
      <Topbar/>

      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-5 h-full'>
          {/* Left */}
          <div className='hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
              <ProfileCard user={user} id={user?._id}/>
              <FriendsCard friends={user?.friends} id={user?._id}/>
          </div>
          {/* Center */}
          <div className='flex-1 h-full flex flex-col  shadow-sm rounded-lg px-4  gap-6 overflow-y-auto'>
            <form 
            onSubmit={handleSubmit(HandlePostSubmit)}
            className='bg-primary rounded-lg px-4'>
                <div className='w-full flex items-center justify-between pb-2 gap-2 py-4 border-b border-[#66666645]'>
                  <img src={user?.profileUrl ?? Noprofile} alt={user?.email} className='w-14 h-14 object-cover rounded-full' />
                 
                  <Textinputs
                  name='description'
                  type="text"
                  placeholder="whats on your mind...."
                  styles='w-full rounded-full py-5 mb-3'
                  register = {register('description',{
                    required: "write something about Post"
                  }) }
                  error = {errors.description  ? errors.description.message : ''}/>
                  {
                    ErrMsg?.message && (
                        <span className={`text-sm mt-0.5 ${
                          ErrMsg.status ==="failed" ? 'text-[#f64949fe]' : 'text-[#2ba150fe]'
                        }`}>{ErrMsg.message}</span>
                    )
                  }
                 </div> 

                  <div className='flex items-center justify-between py-4'>
                    <label
                     htmlFor='image'
                     className='flex items-center gap-1 text-base text-ascent-2 hover:text to-ascent-1 cursor-pointer'>
                      <input 
                      type="file"
                      id='image'
                      onChange={(e)=> {
                        setFile(e.target.files[0])
                        setresourceType(e.target.id)
                      }}
                      accept='.jpg, .png , .jpeg '
                      className='hidden' 
                     />
                      <BiImage />
                      <span>Image</span>
                    </label>

                    <label
                     htmlFor='video'
                     className='flex items-center gap-1 text-base text-ascent-2 hover:text to-ascent-1 cursor-pointer'>
                      <input 
                      type="file"
                      id='video'
                      onChange={(e)=> {
                        setFile(e.target.files[0])
                        setresourceType(e.target.id)
                      }}
                      accept='.mp4, .wav'
                      className='hidden' 
                      data-max-size="5120"/>
                      <BiVideo />
                      <span>Video</span>
                    </label>

                    <label
                     htmlFor='Gif'
                     className='flex items-center gap-1 text-base text-ascent-2 hover:text to-ascent-1 cursor-pointer'>
                      <input 
                      type="file"
                      id='Gif'
                      onChange={(e)=> setFile(e.target.files[0])}
                      accept='.gif'
                      className='hidden' 
                      data-max-size="5120"/>
                      <BsFiletypeGif/>
                      <span>Gif</span>
                    </label>
                      <div>
                      {
                      post ? <Loading/> :
                     <CustomButton
                     type="submit"
                     containStyle='inline-flex w-full justify-center rounded-md text-sm px-8 py-3 bg-blue text-white font-medium outline-none'
                     title='Post'
                     onClick={() => {

                   }}
                   />
                  }
                  </div>

                  </div>
             
                    
            </form>
            {
              loading ? (<Loading/> ) : (posts.length > 0 ? (
                posts.map(post => (
                  <PostCard key={post._id} post={post} user={user} deletePost={handleDeletePost} likePost={handlelikePost}/>
                ))
              ) : 
               <div className='flex w-full h-full items-center justify-center'>
                    <p className='text-sm text-ascent-2'>No Post Available</p>
              </div>
              )
            }
          </div>
          {/* Right */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-6 overflow-y-auto'>
              {/* FriendsRequest */}
                <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-4'>
                <div className='w-full flex items-center justify-between pb-2 border-b border-[#66666645] text-xl text-ascent-1'> 
                <span>Friends Request</span>
                <span>{friendsRequest.length}</span>
                </div>
                <div className='w-full flex flex-col pt-4 gap-4'>
                  {
                    friendsRequest.map(({_id , requestFrom : from}) => (
                      <div className='w-full flex items-center justify-between'>
                      <Link 
                       key={_id}
                       className='w-full flex gap-4 items-center cursor-pointer'> 
                         <img src={from?.profileUrl ?? Noprofile} alt={from?.email} className='w-14 h-14 object-cover rounded-full' />
                       <div className='flex flex-col justify-center mx-2'>
                          <p className='text-lg font-medium text-ascent-1'>{from?.firstName} {from?.lastName}</p>
                          <span className='text-ascent-2'>{from?.profession ?? " No profession"}</span>
                       </div>

                      </Link>
                         <div className='flex gap-1'>
                            <CustomButton
                            onClick={() =>AcceptedFriends(_id , 'Accepted')}
                            title='Accept'
                            containStyle='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'/>

                            <CustomButton
                            title='Deny'
                            onClick={() =>AcceptedFriends(_id , 'Denied')}
                            containStyle='bg-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'/>
                        </div>
                      </div>
                    ))
                  }
                </div>
                </div>
              {/* Suggested Friends */}
              <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-4'>
                <div className='w-full flex items-center justify-between pb-2 border-b border-[#66666645] text-xl text-ascent-1'> 
                <span>Friends Suggest</span>
                </div>
                <div className='w-full flex flex-col pt-4 gap-4'>
                  {
                    SuggestedRequest.map((friend) => (
                      <div className='w-full flex items-center justify-between'>
                      <Link 
                       key={friend?._id}
                       to={`/profile/${friend?._id}`}
                       className='w-full flex gap-4 items-center cursor-pointer'> 
                         <img src={friend?.profileUrl ?? Noprofile} alt={friend?.email} className='w-14 h-14 object-cover rounded-full' />
                       <div className='flex flex-col justify-center mx-2'>
                          <p className='text-lg font-medium text-ascent-1'>{friend?.firstName} {friend?.lastName}</p>
                          <span className='text-ascent-2'>{friend?.profession ?? " No profession"}</span>
                       </div>

                      </Link>
                         <div className='flex gap-1'>
                          <button
                          className='bg-[#0444a430] text-sm text-white p-1 rounded cursor-pointer outline'
                          onClick={() => handleFriendsRequest(friend?._id)}>
                            <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
                </div>
          </div>
      </div>
    </div>
    {
      edit && <EditProfile />
    }
    
    </>
  )
}

export default Home
