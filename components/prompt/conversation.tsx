"use client";

import React from "react";

import MessageCard from "./message-card";

import {chatHistory$} from "@/stores/chat";

export default function Component() {
  const messages = chatHistory$.messages.get();

  return (
    <div className="flex flex-col gap-4 px-1">
      {messages.map(({ role, message, tables, status }, index) => (
        <MessageCard
          key={index}
          attempts={1}
          avatar={
            role === "assistant"
              ? "https://assets-global.website-files.com/6328b4e5e36c3fe82d4fa984/63446875e03a2d2443b12e9c_favicon-32x32.png"
              : "https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png"
          }
          currentAttempt={1}
          message={message}
          messageClassName={
            role === "user" ? "bg-content3 text-content3-foreground" : ""
          }
          showFeedback={role === "assistant"}
          status={status}
          tables={tables}
        />
      ))}
    </div>
  );
}
