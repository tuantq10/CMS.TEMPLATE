import React, { Component, Fragment, useEffect, useState } from 'react';
import UploadFileResumable from '../UploadFileResumable'
import { callApi } from "../../utils/apiCaller";
export const UploadFileChuck = ({target,endpointCallCreateSession,endpointUploadAzureCompleted,isUploadAzure,uploaderID,linkDownload,dropTargetID,chunkSize}) => {
     const [sessionId, setSessionId] = useState('');
     const createSession = async (file, resumable) => {
        let result = await callApi(endpointCallCreateSession,{},{
          ChunkSize: chunkSize,
          TotalSize: file.size,
          FileName: file.fileName
        },"POST");
       if(result && result.status == 200)  {
          resumable.opts.target =  target + result.data.sessionId;
          file.sessionId = result.data.sessionId;
          setSessionId(result.data.sessionId);
          resumable.upload();
       }
    }
    const onCallSuccess = async (file) => {
      if(endpointUploadAzureCompleted && isUploadAzure)
      {
          await callApi(endpointUploadAzureCompleted,{},{
            sessionId: sessionId
          },"POST");
      }
    }
    return (
        <Fragment>
          <UploadFileResumable
            uploaderID={uploaderID}
            dropTargetID={dropTargetID}
            service={target}
            onUploadCompleted={(data) => {
              onCallSuccess(data);
            }}
            onFileAdded={(file, resumable) => {
              createSession(file,resumable);
            }}
            chunkSize={chunkSize}
            forceChunkSize={true}
            simultaneousUploads={1}
            uploadMethod="Put"
            throttleProgressCallbacks={1}
            fileParameterName="file"
            chunkNumberParameterName="chunkNumber"
            chunkSizeParameterName="chunkSize"
            currentChunkSizeParameterName="chunkSize"
            fileNameParameterName="fileName"
            totalSizeParameterName="totalSize"
            linkDownload={linkDownload}
          />
        </Fragment>
    );
};