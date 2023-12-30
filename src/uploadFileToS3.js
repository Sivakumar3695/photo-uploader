import { Upload } from '@aws-sdk/lib-storage'
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

import { S3Client } from '@aws-sdk/client-s3';
import AWS_CONFIG from './config/awsConfig';

function getS3UploadParams(file) {
    return {
        Bucket: AWS_CONFIG.s3Bucket,
        Key: file.name,
        Body: file,
        ContentType: file.type,
      }
}

function createUploadCommand(token, file) {
    return new Upload({
        client: new S3Client({
        region: AWS_CONFIG.region,
        credentials: fromCognitoIdentityPool({
            clientConfig: { 
                region: AWS_CONFIG.region 
            }, 
            identityPoolId: AWS_CONFIG.identityPoolId,
            logins: {
                'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SaNecr3bT': token.toString()
            },
        })
        }),
        params: getS3UploadParams(file),
    });
}

export default async function uploadToS3(file, load, error, progress, token) {
    try {

        if (localStorage.getItem(file.name)) {
          load(file.name)
          return
        }

        const command = createUploadCommand(token, file)

        command.on('httpUploadProgress', (event) => {
          progress(event.loaded / event.total * 100);
        });

        await command.done() 
        load(file.name)
        localStorage.setItem(file.name, true)
      } catch(e) {
        console.log(e);
        error(file.name)
      } 
}