import React, { useState } from "react";
import axios from 'axios';
import Message from "./Message";
import Progress from './Progress';

export const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile , setUploadedFile] = useState({});
  const [message,setMessage] = useState(''); 
  const [uploadPercentage , setUploadPercentage] = useState(0);
  const [loading ,setLoading] = useState(false);

  const onInputChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
    
  }

  const onSubmit = async e =>{
    e.preventDefault();
    const formData = new FormData();

    formData.append('file',file);
    setLoading(true)

    try{
      const res= await axios.post("/upload",formData,{
        headers : {
          'Content-Type':'multipart/form-data'
        },onUploadProgress : ProgressEvent => {
          setUploadPercentage(parseInt(Math.round(
            (ProgressEvent.loaded * 100)/
          ProgressEvent.total)))

      //clear percentage
      setTimeout(() => setUploadPercentage(0),5000)
     
      }
     
    });

      const {fileName,filePath} =res.data;

      setUploadedFile({fileName,filePath})

      setMessage('File Uploaded')
    }catch(err){
      if(err.response.status === 500){
        setMessage("There was a problem with server")
      }else{
        setMessage(err.response.data.msg)
      }
    }
       


    }
  return (
    <>
    {message ? <Message msg={message} /> : null}
      <form onSubmit = {onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customfile"
            onChange={onInputChange}
          />
          <label className="custom-file-label" htmlFor="customfile">
            {filename}
          </label>
        </div>
{
 loading ?  <Progress percentage={uploadPercentage}/> : null
}
       
        <input
          type="submit"
          value="upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>

      {
        uploadedFile ? <div className="row mt-5">
          <div className ="col-md-6 m-auto">
          <h3 className="text-center">{uploadedFile.fileName}</h3>
          <img style={{ width : '100%' }} src={uploadedFile.filePath} alt=""/>
          </div>
        </div>: null
        
      }
   </>)

}
