
import { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import Axios, * as others from 'axios';
import ErrorMessage from "./ErrorMessage";



const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address
    };
  } catch (err) {
    setError(err.message);
  }
};

export default function SignMessage() {
 
  const resultBox = useRef();
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();

  const register= async(uuid,walletAddress)=>{
    const json = JSON.stringify({ id: uuid , userAddress:walletAddress });
    const res = await Axios.post('https://game-service-zu5i.onrender.com/user', json, {
    headers: {
          'Content-Type': 'application/json'
        }
    });

    res.data.data; 
    res.data.headers['Content-Type']; 
    console.log("apiye yazıldı")
  };

  const handleSign = async (uuid) => {
    
    setError();
    const sig = await signMessage({
      setError,
      message: uuid
    });
    if (sig) {
      setSignatures([...signatures, sig]);
      console.log("imzalandı")
      register(uuid,sig.address)

    }
  };

  useEffect(()=>{
   

   const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get('id'))
    handleSign(urlParams.get('id'))
      
      }, [])

  return (
    <form className="m-4" onSubmit={handleSign}>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        
       
        {signatures.map((sig, idx) => {
          return (
              <div className="my-3">
                <p>Thanks for Signing. You may return to game. Enjoy!</p>
                <p>
                  Signute Message: {sig.message}
                </p>
                <p>Signer: {sig.address}</p>
                <p>Proof: </p>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                  placeholder="Generated signature"
                  value={sig.signature}
                />
              </div>
          );
        })}
      </div>
    </form>
  );
}
