import React, { Component, Fragment, useEffect, useState } from 'react';
import UploadFileResumable from '../UploadFileResumable'
import { endpoint } from '../../../constants/endpoint';
import { callApi } from "../../../utils/apiCaller";
import './index.less';
export const UploadFileChuck = (host,uploaderID,dropTargetID) => {
    const [sessionId, setSessionId] = useState("");
    const createSession = async (file, resumable) => {
        console.log(file);
        let result = await callApi(endpoint.createSession,{},{
          UserId: 11,
          ChunkSize: 1*1024*1024,
          TotalSize: file.size,
          FileName: file.fileName
        },"POST");
       if(result && result.status == 200)  {
          resumable.opts.target =  resumable.opts.target + result.data.sessionId;
          console.log(resumable.opts);
          console.log(result);
          setSessionId(result.data.sessionId);
          resumable.upload();
       }
    }
    return (
        <Fragment>
            <p>You can add other inputs, selects or stuff right here to complete a form.</p>
          <UploadFileResumable
            uploaderID="image-upload"
            service={process.env.REACT_APP_API_URL+endpoint.uploadFileChuck}
            onFileSuccess={(file, message) => {
              console.log(file, message);
            }}
            onFileAdded={(file, resumable) => {
              console.log(resumable);
              createSession(file,resumable);
            }}
            chunkSize={1 * 1024 * 1024}
            forceChunkSize={true}
            simultaneousUploads={1}
            uploadMethod="Put"
            testChunks={false}
            throttleProgressCallbacks={1}
            fileParameterName="file"
            chunkNumberParameterName="chunkNumber"
            chunkSizeParameterName="chunkSize"
            currentChunkSizeParameterName="chunkSize"
            fileNameParameterName="fileName"
            totalSizeParameterName="totalSize"
          />
        </Fragment>
    );
};