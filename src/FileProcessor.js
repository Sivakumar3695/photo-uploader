import React, { useEffect, useState} from 'react';

import { FilePond } from 'react-filepond'
import { fetchAuthSession } from 'aws-amplify/auth';


// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import uploadToS3 from './uploadFileToS3';


function FileProcessor() {

  const [idToken, setIdToken] = useState(null)

  useEffect(() => {
    async function currentSession() {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
        setIdToken(idToken)
      } catch (err) {
        console.log(err);
      }
    }

    currentSession()
  }, [])

  return (
    <FilePond
        allowMultiple={true}
        server={{
          process: async (fieldName, file, metadata, load, error, progress, abort) => {
            uploadToS3(file, load, error, progress, idToken)
          }
        }}
      />
  );
}

export default FileProcessor;
