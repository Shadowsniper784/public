import React, {Component, useState, useRef} from "react"
import {Guild} from '../utils/types'
import axios from 'axios'
import {
  Button,
  DropdownFooter,
  DropdownHeader,
  DropdownItem,
  DropdownItemContainer,
  Input,
} from "../utils/styles";
interface TextProps {
  title: string;
  guild: any;
  default: string
}
function update(text:string,title:string,guild:any) {
  axios.put('/api/guild/'+guild.id+'/config',{title,value:text})
}

export function TextInput(props: TextProps) {
const input = useRef<HTMLInputElement>(null);
  const [text,setText]=useState(props.default)
  return   <div>
    <input type="text" defaultValue={props.default} ref={input} onChange={()=>setText(input?.current?.value || props.default)} />
    <Button style={{ marginRight: "5px" }} onClick={()=>update(text,props.title,props.guild)}>
              Save
            </Button></div>
}