import Peer, { MediaConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";
import getBrowserMedia from "./utils/getDevices.js";

const PORT = 9090;
// Socket.io client setup
const socket = io(`http://localhost:${PORT}`,{
  extraHeaders : { 'Accept': 'application/json' }
});


const peer = new Peer({
  host: 'localhost',
  port: PORT + 1,
  path: '/'
});
// Define the type for user objects


const GroupCall = () => {

  const [allUsers, setAllUsers] = useState<Array<{callerID:string, id: string}>>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const myStreamRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamUserRef = useRef<HTMLVideoElement | null>(null);


  function addRemoteVideo(stream) {
    const videoElement = document.createElement('video');
    videoElement.classList.add("rounded-md")
    videoElement.srcObject = stream;
    videoElement.play();
    document.getElementById('video-container').appendChild(videoElement);
  }
  

 
  useEffect(() => {
    peer.on("open", (id: string) => {
      setMyId(id);
      socket.emit("login", id);
    });

    socket.on("user",(data)=>{
      setAllUsers(data);
    })
   
    getBrowserMedia({ audio: false, video: true }).then((currentStream : any) => {
      if (myStreamRef.current) {
        myStreamRef.current.srcObject = currentStream;
      }

      peer.on("call", (call: MediaConnection) => {
        
        call.answer(currentStream); // Answer the call with our stream
        call.on("stream", (remoteStream: MediaStream) => {
            addRemoteVideo(remoteStream)
          
        });
      });
    });

   
   window.addEventListener("beforeunload", () => {
    peer.destroy();
   })
      // Handle errors
  peer.on("error", (err: Error) => {
    peer.destroy();
    console.error("Peer connection error:", err);
  });
  
  // Use onbeforeunload for page unload handling
  return ()=>{
    // peer.destroy();
  }
  }, []);

  const callUser = (userId: string | null) => {
    getBrowserMedia({ audio: true, video: true }).then((currentStream : any) => {
      if (myStreamRef.current) {
        myStreamRef.current.srcObject = currentStream;
      }

      const call = peer.call(userId as string, currentStream);
      call?.on("stream", (remoteStream: MediaStream) => {
        addRemoteVideo(remoteStream)
        // if (remoteStreamUserRef.current) {
        //   remoteStreamUserRef.current.srcObject = remoteStream;
        // }
      });
    });

  };

  return (
    <div className="backdrop-blur-[10px] min-h-screen">
      <div className="flex justify-center pt-5">
        <p className="text-gray-300 font-semibold text-2xl bg-slate-800 py-2 px-10 rounded-md">
          Video Calling
        </p>
      </div>
      <div className="flex justify-center max-h-[20] overflow-y-auto">
        <div className="grid grid-cols-6 gap-6 w-[80%]  justify-center">
          {allUsers
            ?.filter((user) => user?.callerID !== myId)
            ?.map((item) => (
              <button
                key={item?.callerID}
                onClick={() => {
                    callUser(item?.callerID)
                    const exitUsers = allUsers.filter((user) => user?.callerID !== item?.callerID)
                    setAllUsers(exitUsers)
                     
                }}
                className="p-2 text-white font-semibold bg-blue-500 rounded-md"
              >
                Call - <span className="text-green-100"> {item?.callerID.split("-")[0]}</span>
              </button>
            ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-[1%]">
        <div className="flex w-[80vw] justify-center gap-3 items-center justify-items-center">
          <div className="  flex-1  bg-slate-700 rounded-md p-2">
          <p className="text-slate-200 font-semibold text-sm p-2">{myId?.split("-")![0]}</p>
            <video
              className="object-cover"
              ref={myStreamRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
          </div>
          <div id="video-container" className=" max-h-[67vh] min-h-[67vh] flex-1 grid grid-cols-3 overflow-y-auto gap-2 bg-slate-700 rounded-md p-2">
            {/* <video
              className="object-cover"
              ref={remoteStreamUserRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            /> */}
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default GroupCall;
