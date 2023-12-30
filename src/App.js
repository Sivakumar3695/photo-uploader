import FileProcessor from './FileProcessor';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './config/amplifyconfiguration.json';
Amplify.configure(config);

function App({signOut, user}) {

  return (
    <>
        <FileProcessor/>
        <button onClick={signOut}>Signout</button>
    </>
      
  );
}

export default withAuthenticator(App);
