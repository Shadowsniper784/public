
import * as React from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { Menu } from "./components/Menu";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./pages/Dashboard";
import { GuildContextProvider } from "./utils/contexts/GuildContext";
import { GuildStoreContextProvider } from "./utils/contexts/GuildStoreContext";
import { Guild } from "./utils/types";
import { useQuery } from "@apollo/client";
import { getUser } from "./graphql";
import { guilds as mockGuilds } from "./__mocks__";
import axios from 'axios'

function App() {
  const [guild, setGuild] = React.useState<Guild | undefined>();
  const [guilds, setGuilds] = React.useState<Guild[]>([]);
  const [token, setToken] = React.useState<any>()
  const history = useHistory();

   //const { loading, error } = useQuery(getUser, {
   // onCompleted: ({ getUser }) => {
   //   const { guilds } = getUser;
  //     setGuilds(guilds);
  //   },
  // });

  // console.log(error);

  // if (loading) return <h1>Loading</h1>;
  // if (error) return <h1>You are making too many requests.</h1>;
  React.useEffect(() => {
  
    async function run() {
      const inst = axios.create({
  baseURL: 'https://public.shadowsniper784.repl.co'
})
    let search = window.location.search;
let query = new URLSearchParams(search)
    if(query.has('code') || 
       (
         window.localStorage.getItem('access_token') && 
         window.localStorage.getItem('refresh_on') &&
         Math.round(Date.now() / 1000) < parseInt(window.localStorage.getItem('refresh_on')!)
       ) || 
       window.localStorage.getItem('refresh_token')) {
  if(window.localStorage.getItem('access_token') && window.localStorage.getItem('refresh_on') && Date.now() < parseInt(window.localStorage.getItem('refresh_on')!)) {
        console.log('No request needed access token: %s',window.localStorage.getItem('access_token'))
        setToken(window.localStorage.getItem('access_token')!)
      } else if(localStorage.getItem('refresh_token')) {
        let data:any = await axios.post('/api/refresh',{
          refresh_token:window.localStorage.getItem('refresh_token')
        })
        console.log('Request now %o',data)
        data=data.data

         window.localStorage.setItem('access_token',data.access_token)
        window.localStorage.setItem('refresh_on',data.refresh_on)
        setToken(data.access_token)
      }else    if(query.has('code')) {
        console.log('Has code: %s',query.get('code'))
        let data: any = await axios.get('/api/access',{
          params:{
           code: query.get('code')
        }
      })
        console.log('Request finished: %o', data)
        data = data.data
  
        window.localStorage.setItem('access_token',data.access_token)
        window.localStorage.setItem('refresh_on',data.refresh_on)
        window.localStorage.setItem('refresh_token',data.refresh_token)
        setToken(data.access_token)
      }
              console.log('Getting guilds: %s', window.localStorage.getItem('access_token'))
      let servers: any = await axios.post('/api/guilds',{access_token:window.localStorage.getItem('access_token') })
              console.log('Request finished: %o', servers)
      setGuilds(servers.data)
    } else {
          window.location.href = 'https://public.shadowsniper784.repl.co/api/login' 
  //  setGuilds([])
    }
    }
    run()
  }, []);
  
  return (
    <Providers
      guild={guild}
      setGuild={setGuild}
      guilds={guilds}
      setGuilds={setGuilds}
    >
      <Sidebar guilds={guilds} history={history} />
      <Menu title={guild ? guild.name : 'Shadow Public'} history={history} />
      <Routes />
    </Providers>
  );
}

function Providers({ children, guild, setGuild, guilds, setGuilds }: any) {
  
  return (
    <GuildContextProvider value={{ guild, setGuild }}>
      <GuildStoreContextProvider value={{ guilds, setGuilds }}>
        {children}
      </GuildStoreContextProvider>
    </GuildContextProvider>
  );
}

function Routes() {
  return (
    <Switch>
      <Route path="/" exact={true} component={DashboardPage} />
      <Route
        path="/dashboard/:guildId"
        exact={true}
        component={DashboardPage}
      />
      <Route
        path="/dashboard/:guildId/general"
        exact={true}
        component={DashboardPage}
      />
      
    </Switch>
  );
}

export default App;

