import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Noprofile, postComments } from '../Assets'
import moment from 'moment'

//Icon
import {BiSolidLike, BiLike, BiCommentAdd, BiComment} from 'react-icons/bi'
import {MdOutlineDeleteOutline} from 'react-icons/md'
import { useForm } from 'react-hook-form'
import Textinputs from './Textinputs'
import Loading from './Loading'
import CustomButton from './CustomButton'
import { requestApi } from '../utils'
//End

//Component Initialization
 const GetPostComment = async (id ,token) =>{
       
        try {  
         const res = await requestApi({
          url : "/posts/comment/"+ id,
          token : token ,
          method : "GET"
         })
       return res?.data
    } catch (error) {
        console.log(error);
    }
 }
const CommentForm = ({user , replyAt , id , getcomment}) =>{
    const[loading , Setloading] = useState(false)
    const[ErrMsg ,setErrMsg] = useState("");
    const{register, handleSubmit ,reset ,formState:{errors} } = useForm({
        mode: 'onChange'
        })
        const Onsumbit = async(data) =>{
            Setloading(true)
            setErrMsg(" ")
            try {
                const Url = !replyAt ? "/posts/comment/"+id : "/posts/reply-comment/" +id ;
                const newData = {
                        comment : data?.comment,
                        from : user?.firstName + " " + user?.lastName ,
                        replyAt :replyAt
                }
                const res = await requestApi({
                    url : Url,
                    data : newData,
                    token: user?.token,
                    method : "POST"
                   })
                   if(res?.status === 'failied'){
                    setErrMsg(res)
                   }else{
                    reset({
                        comment : " "
                    })
               
                    setErrMsg("")
                    await getcomment()
                   
                   }
                   Setloading(false)
            } catch (error) {
                console.log(error);
                Setloading(false)
            }
        }
    return(
        <form  
        onSubmit={handleSubmit(Onsumbit)}
        className='w-full border-b border-[#66666645]'>
            <div className='py-4 flex comments-center gap-2'>
                <img src={user?.profileUrl ?? Noprofile}
                 alt={user?.firstName} 
                 className='w-10 h-10 object-cover rounded-full'/>

               <Textinputs
                  name='comment'
                  type="text"
                  placeholder={replyAt ? `Reply @${replyAt}` : 'Comment this Post'}
                  styles='w-full rounded-full py-3 '
                  register = {register('comment',{
                    required: "comment can not be empty"
                  }) } 
                  error = {errors.comment  ? errors.comment.message : ''}
                />

            </div>
            {
                    ErrMsg?.message && (
                        <span className={`text-sm mt-0.5 ${
                          ErrMsg.status ==="failed" ? 'text-[#f64949fe]' : 'text-[#2ba150fe]'
                        }`}>{ErrMsg.message}</span>
                    )
                  }
                <div className='flex justify-end comments-end pb-2 '>
                {
                    loading ? <Loading/> :
                   <CustomButton
                   type="submit"
                   containStyle='w-full justify-center rounded-full text-sm px-8 py-3 bg-blue text-white font-medium outline-none mt-5'
                   title='sumbit'
                   onClick={() => {

                   }}
                   />
                  }


                </div>        
        </form>
    )
}

const ReplyCard = ({user , reply , handleLike}) =>{
     return(
        <div className='w-full py-3'>
             <div className='flex comments-center gap-3 mb-1'>
                <Link
                to={"/profile/"+reply?.userId?._id}>
                  <img src={reply?.userId?.profileUrl ?? Noprofile}
                   alt={reply?.userId?.firstName} 
                   className='w-10 h-10 object-cover rounded-full'/>
                </Link>
                <div>
                <Link to={"/profile/" + reply?.userId?._id}>
                          <p className='flex comments-center gap-2 text-base text-ascent-1'>
                                    {reply?.userId?.firstName}{reply?.userId?.latsName}
                         </p>
                </Link>
                  <span className='text-ascent-2 text-base'>
                    {moment(reply?.created_At ?? " 2024-04-30").fromNow()}
                 </span>
                 </div>
            </div>
            <div className='ml-12'>
                        <p className='text-base text-ascent-2'>{reply?.comment}</p>
                        <div className='mt-2 flex gap-6'>
                    <p className='flex gap-2 comments-center text-base cursor-pointer text-ascent-2 '
                    onClick={(e) =>  handleLike()}>
                         {
                             reply?.likes?.includes(user?._id) ?
                                ( <BiSolidLike size={20} color={'blue'} />)
                                 :
                                   (<BiLike size={20}/>)
                          }
                         {reply.likes?.length} Likes
                  </p>
                  <span/>
                  </div>
                  </div>
        </div>
     )
}
//End
function PostCard({post , user, deletePost , likePost ,type}) {
    //State
        const[showAll , SetshowAll] = useState(0)
        const[showreply , Setshowreply] = useState(0)
        const[loading , Setloading] = useState(false)
        const[comments , Setcomment] = useState([])
        const[replycomment , Setreplycomment] = useState(0)
        const[showcomment, Setshowcomment] = useState(0)
    //END
    const getcomment = async (id) => {
       Setreplycomment(0)
       Setshowreply(0)
       const result = await GetPostComment(id, user?.token)
       console.log(result, "comment result");
        Setcomment(result)
        Setloading(false)

    }
    const handleLike = async (url) =>{
         await likePost(url)
         await getcomment(post?._id)
    }
  return (
    <div className='mb-3 bg-primary p-4 rounded-xl'>
      <div className='flex gap-3 items-center mb-2'>
            <Link to={'/profile/'+post?.userId?._id}
            className='flex items-center px-3'>
                <img src={post?.userId?. profileUrl ?? Noprofile} 
                alt={post?.userId?.firstName} 
                className='w-12 h-12 md:w-14 md:h-14 object-cover rounded-full'/>
            </Link>

            <div className='w-full flex justify-between'>
                <div className=''>
                    <Link 
                    to={'/profile/'+post?.userId?._id}
                    className=' '>
                        <p className='font-medium text-sm md:text-lg text-ascent-1'>{post?.userId?.firstName} {post?.userId?.lastName}</p>
                        
                    </Link>
                    <span className='text-sm text-ascent-2'>{post?.userId?.location}</span>
                    <span className='md:hidden flex text-ascent-2 text-base'>
                        {moment(post?.createdAt ?? " 2024-04-30").fromNow()}
                    </span>
                </div>
                <div>
                <span className='hidden md:flex text-ascent-2 text-base'>
                        {moment(post?.createdAt ?? " 2024-04-30").fromNow()}
                    </span>
                </div>
            </div>

      </div>
      <div className=''>
            <p className='text-base text-ascent-1'>
                {
                    showAll === post?._id ? post?.description : post?.description?.slice(0, 300)
                }
                    {
                        post?.description?.length > 0  &&(
                            showAll === post?._id ? 
                            <span className='text-sm text-blue cursor-pointer' onClick={() => SetshowAll(0)}>show Less</span>  : 
                            <span className='text-sm text-blue cursor-pointer' onClick={() =>SetshowAll(post?._id)}> show more</span>
                        )
                    
                      }
                
            </p>

            {
                post?.image && (
                   
                    <img src={post?.image} alt="post image" className='rounded-lg mt-2 w-full' />
                   
                    
                ) 
                
            }
            {
                post?.video && (
                    
                    <video width="750" height="500" controls >
                    <source src={post?.video} type="video/mp4"/>
                   </video>
                    
                )
            }

      </div>
      <div className='w-full mt-4 px-3 py-2 flex items-center justify-between  border-t border-[#66666645] text-ascent-2 text-base'>
            <p className='flex gap-2 items-center text-base cursor-pointer'
            onClick={() => handleLike('/posts/like-post/' + post?._id)} >
                {
                    post?.likes?.includes(user?._id) ?
                   ( <BiSolidLike size={20} className="text-blue" />)
                    :
                    (<BiLike size={20}/>)
                }
                  {post.likes?.length} Like
            </p>
            <p className='flex gap-2 items-center text-base cursor-pointer'
            onClick={() => {
                Setshowcomment(showcomment === post?._id ? null : post?._id)
                getcomment(post?._id)
            }}>      
                 <BiComment size={20}  />
                {post.comments?.length} comments
            </p>
            {
                user._id === post?.userId?._id && (
                    <div className='flex gap-2 items-center text-base text-ascent-1 cursor-pointer'>
                        <MdOutlineDeleteOutline size={20}/>
                        <span onClick={() => deletePost(post?._id)}>Delete</span>
                    </div>
                )
            }
      </div>
      {
        showcomment === post?._id &&(
            <div className='w-full mt-4  border-t border-[#66666645]'>
                < CommentForm 
                user={user}
                id={post?._id}
                getcomment={() => getcomment(post?._id)}/>   

{
        loading ? (<Loading/>) : 
           comments?.length > 0 ? 
            (comments?.map(comment => (
                <div className='w-full py-2' key={comment?._id}>
                    <div className='flex gap-4 items-center mb-1'>
                        <Link to={"/profile/"+ comment?.userId?._id}>
                        <img src={comment?.userId?.profileUrl ?? Noprofile}
                             alt={comment?.userId?.firstName} 
                             className='w-10 h-10 object-cover rounded-full'/>
                        </Link>
                        <div>
                            <Link to={"/profile/" + comment?.userId?._id}>
                            <p className='flex items-center gap-2 text-base text-ascent-1'>
                                {comment?.userId?.firstName}{comment?.userId?.latsName}
                            </p>
                            </Link>
                            <span className='text-ascent-2 text-base '>
                           {moment(comment?.createdAt ?? " 2024-04-30").fromNow()}
                            </span>
                        </div>
                    </div>
                    <div className='ml-14'>
                        <p className='text-base text-ascent-2'>{comment?.comments}</p>
                        <div className='mt-2 flex gap-6'>
                    <p className='flex gap-2 items-center text-base cursor-pointer text-ascent-2 '
                    onClick={() => handleLike('/posts/like-comment/' + comment?._id  )}>
                         {
                             comment?.likes?.includes(user?._id) ?
                                ( <BiSolidLike size={20} className='text-blue' />)
                                 :
                                   (<BiLike size={20}/>)
                          }
                         {comment.likes?.length} Likes
                  </p>
                  <span
                  className='text-blue cursor-pointer'
                  onClick={() => Setreplycomment(comment?._id)}>
                        Reply

                  </span>
                    </div>
                          {
                            replycomment === comment?._id && ( 
                             <CommentForm 
                            user={user}
                            id={comment?._id}
                            replyAt={comment?.from}
                            getcomment={() => getcomment(post?._id)}/>
                            )
                          }

                    </div>
                   {/* Replies */}
                   <div className='py-4 px-8 mt-6'>
                    {
                        comment?.replies?.length > 0 &&(

                            <p
                            className='text-base text-ascent-1'
                            onClick={() => {
                                Setshowreply(
                                    showreply === comment?.replies?._id ? 0 : comment?.replis?._id
                                )
                            }}>
                                Show Reply ({comment?.replies?.length})
                            </p>

                        ) }
                        {
                                showreply === comment?.replies?._id && (
                                   
                                   comment?.replies?.map( reply => (
                                    <ReplyCard 
                                    user={user}
                                    reply={reply}
                                    key={reply?._id}
                                    handleLike={() => handleLike("/posts/like-comment/" + comment?._id + "/" + reply?._id )}/>
                                   ))
                                    
                                )
                            }
                            
                   </div>
                </div>
            ))) : 
            (
              <span className={'flex py-4  text-sm text-ascent-2 text-center' }>
                No comment, be first to comment
              </span> 
            )
           
        }
            </div>
            
        )}
      
    </div>
  )
}

export default PostCard
