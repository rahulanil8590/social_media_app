
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EditProfile, FriendsCard, Loading, PostCard, ProfileCard, Topbar } from '../Component';
import { posts } from '../Assets/Data';
import { DeletePost, FetchPosts, LikePost, getUserInfo, viewProfile } from '../utils';


function Profile() {
  const { user , edit} = useSelector((state) => state.user);
   const { posts } = useSelector((state) => state.posts)
    const dispatch = useDispatch()
    const[loading , Setloading] = useState(false)
    const[Userinfo , SetUserinfo] = useState(user)
    const {id} = useParams()
    console.log(id , "user ID is this +{C+C+=+}");
    const uri ="/posts/get-user-post/" + id
    //get User
    const getUser = async() =>{
      const res = await getUserInfo(user?.token ,id)
      SetUserinfo(res)
    }
    const getPosts = async() =>{
     
      try {
         await FetchPosts(user?.token , dispatch ,uri)
        Setloading(false)
      } catch (error) {
        console.log(error);
      }
    }
    const deletePost = async (id) =>{
      await DeletePost(id , user?.token)
      await getPosts()
    }
    const handlelikePost = async(url) =>{
      const data = {url  : url , token: user?.token}
      await LikePost(data)
      await getPosts()
    }

    const getViews = async () =>{
      try {
        const res =  await viewProfile(id , user?.token )
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() =>{
      Setloading(true)
      getUser()
      getPosts()
      getViews()
    },[id])
  return (
    <>
      <div className='home w-full px-0 md:px-4 pb-20 2xl:px-10 h-screen rounded-lg bg-bgColor'>
        <Topbar/>
        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-5 h-full'>
          {/* Left */}
          <div className='hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
              <ProfileCard user={Userinfo} id={id}/>
              <div className='block lg:hidden'>
                <FriendsCard friends={Userinfo?.friends}/>
              </div>  
          </div>
          {/* Center */}
          <div className='flex-1 h-full flex flex-col  shadow-sm rounded-lg px-4  gap-6 overflow-y-auto'>
          {
              loading ? (<Loading/> ) : (posts.length > 0 ? (
                posts.map(post => (
                  <PostCard key={post._id} post={post} user={user} deletePost={deletePost } likePost={handlelikePost}/>
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
             <FriendsCard friends={Userinfo?.friends} id={id} user={user}/>
          </div>

          </div>
    </div>
    {
      edit && <EditProfile />
    }
    </>

  )
}

export default Profile
