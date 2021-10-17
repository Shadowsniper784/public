import * as React from "react";
import { useContext } from "react";
import GuildContext from "../utils/contexts/GuildContext";
import {
  SidebarStyle,
  SidebarHeader,
  IconStyle,
  SidebarContent,
  GuildIcon,
} from "../utils/styles";
import { Guild } from "../utils/types";
import { History } from "history";

type SidebarProps = {
  guilds: Guild[];
  history: History;
};

export const Sidebar = (props: SidebarProps) => {
  const { setGuild } = useContext(GuildContext);
  return (
    <SidebarStyle>
      <SidebarHeader>
        <IconStyle />
      </SidebarHeader>
      <SidebarContent>
        {props.guilds.filter(guild=>guild.owner || guild.permissions==="1099511627775").map((guild) => (
          <GuildIcon        
             bg={guild.icon ? 'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon+(guild.icon.startsWith('a_') ? '.gif' : '.png') : null}
            content={guild.name.split(' ').map(e=>e[0])}
            className="guild-icon"
            key={guild.id}
            onClick={() => {
              setGuild(guild);
             // console.log(guild.icon);
              props.history.push(`/dashboard/${guild.id}`);
            }}
          >
            {guild.icon ? '' : <p>{guild.name.split(' ').map(e=>e[0])}</p>}
          </GuildIcon>
        ))}
      </SidebarContent>
    </SidebarStyle>
  );
};
