import React, {useState} from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';


const Home = () => {

    const navigate = useNavigate();
     const [roomId, setRoomId] = useState('');
     const [username, setUsername] = useState('');
     const createNewRoom=(e) =>
     {
         e.preventDefault();
         const id = uuidV4();
       
         setRoomId(id);
         toast.success('Created a new Room');
     }
     const joinRoom=()=>{
        if(!roomId || !username)
        {
            toast.error('RoomID and username required!');
            return;
        }
        // redirect
        navigate(`/editor/${roomId}`,{
            state:{
               username, 
            }
        });
     }
     const handleInputEnter=(e)=>{
         if(e.code==='Enter'){
            joinRoom();
         }
     }
  return (
    <div className='homePageWrapper'>
        <div className="formWrapper">
            <img src="/code-sync.png" className="homePageLogo" alt="code-sync-logo"/>
            <h4 className="mainLable">Paste Invitation ROOM ID</h4>
            <div className="inputGroup">
                <input type="text" onKeyUp={handleInputEnter } className="inputBox" value={roomId} onChange={ (e)=>setRoomId(e.target.value)} placeholder="ROOM ID"/>
                <input type="text" onKeyUp={handleInputEnter } className="inputBox" value={username} onChange={ (e)=>setUsername(e.target.value)} placeholder="USERNAME"/>
                <button type="submit" onClick={joinRoom} className="btn joinBtn">Join</button>
                <span className="createInfo">
                    If you don't have a invite then create &nbsp;
                    <Link to="#" onClick={createNewRoom} className="createNewBtn">New Room  </Link>
                </span>
            </div>
        </div>
        <footer>
            Built with ❤️ By Aman
        </footer>

    </div>
  )

}

export default Home;