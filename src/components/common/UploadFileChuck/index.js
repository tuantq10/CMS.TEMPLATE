import React, { Component, Fragment, useEffect, useState } from 'react';
import UploadFileResumable from '../UploadFileResumable'
import { callApi } from "../../../utils/apiCaller";
export const UploadFileChuck = ({target,endpointCallCreateSession,uploaderID,linkDownload,dropTargetID}) => {
    const createSession = async (file, resumable) => {
        let result = await callApi(endpointCallCreateSession,{},{
          ChunkSize: 1*1024*1024,
          TotalSize: file.size,
          FileName: file.fileName
        },"POST");
       if(result && result.status == 200)  {
          resumable.opts.target =  target + result.data.sessionId;
          file.sessionId = result.data.sessionId;
          resumable.upload();
       }
    }
    return (
        <Fragment>
          <UploadFileResumable
            uploaderID={uploaderID}
            dropTargetID={dropTargetID}
            service={target}
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