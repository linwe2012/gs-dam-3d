import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import {HomePage} from './homePage/homePage';
import {CataPage} from './cataPage/cataPage';
import {UserPage} from './userPage/userPage';

import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import DetailPanel from './detail-panel'
import { profile, Profile } from './bits/store'
import {Router, Route} from 'react-router-dom'
import SignupOrIn from './signup-or-in';
import UploadModel from './upload-model';
import EditProfile from './edit-profile'

import { MockUser, MockModel } from './utils/mock'
import { red } from '@material-ui/core/colors';
import RenderEditor from './render-editor';
import { D3DModel, APISignin, MakeEmptyUser } from './utils/api';
import { createBrowserHistory } from 'history'
import Cookies from 'universal-cookie';

const history = createBrowserHistory();
const cookies = new Cookies()
const persSave = (key:string, value:string)=>{
  cookies.set(key, value, { path: '/' });
}

const persGet = (key:string)=>{
  return cookies.get(key)
}

const persDel = (...keys:string[])=>{
  for(let k of keys) {
    cookies.remove(k)
  }
}

const App: React.FC = () => {
  const [theme, setTheme] = useState(createMuiTheme({
    palette: {
      primary: blue,
      secondary: red,
    },
  }));
  const toPorfile = useRef<HTMLAnchorElement>(null)
  const toEditPorfile = useRef<HTMLAnchorElement>(null)
  const toEditRender = useRef<HTMLAnchorElement>(null)
  const [openDetail, setOpenDetail] = useState(false)
  const [signupOrSignin, setSignupOrSigin] = useState(true)
  const [openSignupOrSigin, setOpenSignipOrSignin] = useState(false)
  const [user, setUser] = useState(MakeEmptyUser())
  const [openUploadModel, setOpenUploadModel] = useState(false)
  const [logState, setLogState] = useState(false)
  const [editingModel, setEditingodel] = useState<D3DModel>();
  useEffect(()=>{
    const username = persGet('username')
    const password = persGet('password')
    if(username && password) {
      APISignin({username: username, password:password}).then((duser)=>{
        if(duser.ok) {
          setUser(duser.data)
        }
        else {
          persDel('username', 'password');
        }
      }).catch(e=>{
        console.log('failed to connect server')
        // persDel('username', 'password');
        setUser(MockUser()) //TODO: delete
      })
    }
  }, [])
  const pro:Profile  = {
    user: user,
    set: {
      user: setUser,
      logState: setLogState,
      theme: setTheme
    },
    save: {
      login: (username, password)=>{
        persSave('username', username);
        persSave('password', password);
      }
    },
    to: {
      profile: ()=>{
        history.push('/profile');
      },
      edit_profile: ()=>{
        history.push('/profile/edit');
      },
      edit_render: (model: D3DModel)=>{
        setEditingodel(model)
        setEditingodel(MockModel())
        history.push('/model/edit');
      }
    },
    open: {
      uploadModel: openUploadModel
    },
    State:{
      logState: logState
    },
    trigger: {
      uploadModel: setOpenUploadModel,
    },
    triggerSigning: (v)=>{
      setSignupOrSigin(v === 'signup');
      setOpenSignipOrSignin(true);
    }
  }

  
  return (
<ThemeProvider theme={theme}>
  <CssBaseline>
    <profile.Provider value={pro}>
      <Router history={history}>
       <Route exact path='/'>
        <div className="App">
        <div style={{position: 'fixed', left: -100, top: -200}}>
          <a ref={toPorfile} href='/profile' >x</a>
          <a ref={toEditPorfile} href='/profile/edit'>x</a>
          <a ref={toEditRender} href='/model/edit'>x</a>
        </div>
    
        <button onClick={()=>{setOpenDetail(true)}}>Show Detail</button>
        <button onClick={()=>{
          pro.to.profile();
        }}>To Profile</button>
        <button onClick={()=>{
          pro.to.edit_render(MockModel())
        }}>Edit Model</button>
        
        <HomePage/>
    
      </div>
    </Route>
    <Route exact path='/catalog'>
      <CataPage/>
    </Route>
    <Route exact path='/profile'>
      <UserPage />
    </Route>
    <Route exact path='/profile/edit'>
      <EditProfile />
    </Route>
    <Route exact path='/model/edit'>
      <RenderEditor model={editingModel}/>
    </Route>
    </Router>
    <SignupOrIn open={openSignupOrSigin} onClose={()=>{setOpenSignipOrSignin(false)}} isSignUp={signupOrSignin}/>
    <DetailPanel open={openDetail} onClose={()=>setOpenDetail(false)}/>
    <UploadModel></UploadModel>
    </profile.Provider>
  </CssBaseline>
</ThemeProvider>
  );
}

export default App;
