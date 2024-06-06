import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment'

//Icons
    import {LiaEditSolid} from 'react-icons/lia'
    import{BsPersonFillAdd ,BsBriefcase ,BsInstagram , BsFacebook} from 'react-icons/bs'
    import{CiLocationOn} from 'react-icons/ci'
    import{FaTwitterSquare} from 'react-icons/fa'
    import { BsChatLeftDotsFill } from "react-icons/bs";
    import { FaPlus } from "react-icons/fa";
//Ends
//Components
import { SocialMediaLink, UpdateProfile } from '../redux/UserSlice';
import { Noprofile } from '../Assets';
import SocialMediaLinkModal from './SocialMediaLinkModal';
import { getSocialLink, requestApi, sendFriendRequest } from '../utils';

//ends
const ProfileCard = ({user , id}) => {
    const { user:data , edit ,socialLink } = useSelector((state) => state.user);
    const[socailLink , SetsocialLink] = useState(null)
    const[mediaStatus , setMediaStatus] = useState("")
    const[friendsRequest , SetFriendsRequest] = useState([])
    const dispatch = useDispatch()
    const HandleSocialLink = (val) =>{
        dispatch(SocialMediaLink(true))
        setMediaStatus(val)
        console.log(mediaStatus ,"========MediaStatus");
    }
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
    const handleFriendsRequest = async (id) => {
        try {
           const res = await sendFriendRequest(user?.token , id)
           await fetchFriendRequest()
        } catch (error) {
          console.log(error);
        }
      }
    useEffect(() =>{
        const getSocialmediaData = async() =>{
            const _id = data?._id === id ? data?._id : id
            console.log(id , "=====getLink id");
            const res = await getSocialLink(_id , data?.token)
            console.log(res , "===res of socailMedia Link");
            SetsocialLink(res?.data)
        }
        getSocialmediaData()
    },[])
    console.log(socailLink, "=====socialLink");
  return (
    <div>
      <div className='w-full flex flex-col items-center shadow-sm rounded-xl bg-primary px-6 py-4 '>
            <div className='w-full flex items-center justify-between pb-3 border-b border-[#66666645]'> 
             <Link to={"/profile/" + user?._id}
                className='flex gap-2'>
                    <img src={user?.profileUrl ?? Noprofile} alt={user?.email} className='w-14 h-14 object-cover rounded-full' />
                    <div className='flex flex-col justify-center mx-2'>
                        <p className='text-lg font-medium text-ascent-1'>{user?.firstName} {user?.lastName}</p>
                        <span className='text-ascent-2 '>{user?.profession ?? " No profession"}</span>
                    </div>
                    
                </Link>

                <div>
                        {
                            user?._id === data?._id ? (
                                    <LiaEditSolid
                                    size={22}
                                    className='text-blue cursor-pointer'
                                    onClick={() =>  dispatch( UpdateProfile(true))}
                                    />
                                
                            ) : (
                              <button
                              className='bg-[#0444a430] text-sm text-white p-1 rounded'
                              onClick={() => handleFriendsRequest(id)}>
                                <BsPersonFillAdd size={20} className='text-[#0f52b6]'/>
                              </button>
                            )
                            
                        }
                </div>
            </div>
            <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645] '>
                        <div className='flex gap-2 items-center text-ascent-2'>
                            <CiLocationOn  className='text-ascent-1 text-xl'/>
                            <span>{user?.location ?? "Add Location"}</span>

                        </div>
                        <div className='flex gap-2 items-center text-ascent-2'>
                            <BsBriefcase  className='text-ascent-1 text-lg'/>
                            <span>{user?.profession ?? "Add profession"}</span>

                        </div>
            </div>

            <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645] '>
                <p className='text-xl text-ascent-1 font-semibold'>
                    {user?.friends?.length} Friends
                </p>
                <div className='flex items-center justify-between'>
                    <span className='text-ascent-2'>Who viewed your profile</span>
                    <span className='text-ascent-1 text-lg'>{user?.views?.length}</span>

                </div>

                <span className='text-base text-blue'>
                    {user?.verified ? "Account verified " : "Not Verified"}
                </span>

                <div className='flex items-center justify-between'>
                    <span className='text-ascent-2'>Joined</span>
                    <span className='text-ascent-1 text-base'>
                        {moment(user?.createdAt).fromNow()}
                    </span>

                </div>
            </div>
            <div className='w-full flex flex-col gap-4 py-4 pb-6'>
                <p className='text-lg font-semibold text-ascent-1'>Social media</p>
                <Link to={`${socailLink?.instagram}`}>
                      <div className='flex gap-2 items-center text-ascent-2 '>
                        <BsInstagram className='text-xl text-ascent-1'/>
                        <span>Instagram</span>
                       {
                        data?._id === id && <FaPlus className='ml-auto cursor-pointer' onClick={() => HandleSocialLink("instagram")}/>
                       } 
                    </div>
                </Link>
                
                <Link to={`${socailLink?.twitter}`}>
                <div className='flex gap-2 items-center text-ascent-2'>
                        <FaTwitterSquare className='text-xl text-ascent-1'/>
                        <span>Twitter</span>
                        {
                        data?._id === id && <FaPlus className='ml-auto cursor-pointer' onClick={() => HandleSocialLink("twitter")}/>
                       } 
                </div> 
                </Link>
            <Link to={`${socailLink?.facebook}`}>
                <div className='flex gap-2 items-center text-ascent-2'>
                        <BsFacebook className='text-xl text-ascent-1'/>
                        <span>Facebook</span>
                        {
                        data?._id === id && <FaPlus className='ml-auto cursor-pointer' onClick={() => HandleSocialLink("facebook")}/>
                       } 
                        
                </div> 
            
            </Link>      
            </div>
      </div>
      {
        socialLink && <SocialMediaLinkModal mediaStatus={mediaStatus}/>
        
      }
    </div>
  )
}

export default ProfileCard
