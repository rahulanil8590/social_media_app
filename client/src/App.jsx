import {Outlet , Navigate , Route ,Routes , useLocation} from "react-router-dom"
import { Home, Login, Profile, Register, Reset_Password } from "./Pages";
import {useSelector} from "react-redux"
import ChatMessages from "./Pages/ChatMessages";
 const Layout = () =>{
  const {user }= useSelector((state)=> state.user);
  const location = useLocation()
  console.log(user, "==user");
  return user?.token ? (
    <Outlet/>
  ):(
    <Navigate to="/login" state={{from : location}} replace/> 
  )

 }
 
function App() {
  const {theme }= useSelector((state) => state.theme)
  console.log(theme , "==theme");
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
          <Route element={<Layout/>}>
            
            <Route path="/" element={<Home/>} />
            <Route path="/profile/:id" element={<Profile/>} />
            <Route path="/Chat/:id" element={<ChatMessages/>} />
          </Route>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/reset-password" element={<Reset_Password/>} />
         

      </Routes>
    </div>
  );
}

export default App;
