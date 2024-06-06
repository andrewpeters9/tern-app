"use client";

import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { Button, ScrollShadow, Spinner } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { configureObservableSync } from "@legendapp/state/sync";

import { siteConfig } from "@/config/site";
import { subtitle, title } from "@/components/primitives";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/utils/core";
import Conversation from "@/components/prompt/conversation";
import { trpc } from "@/trpc/react";
import { chatHistory$ } from "@/stores/chat";

enableReactTracking({
  auto: true,
});

configureObservableSync({
  persist: {
    plugin: ObservablePersistLocalStorage,
    retrySync: true, // Persist pending changes and retry
  },
  retry: {
    infinite: true, // Retry changes with exponential backoff
  },
});

const ideas = [
  {
    label: "Balance Query",
    title: "How much ETH does 0x1db3439a222c519ab44bb1144fc28167b4fa6ee6 have?",
  },
  {
    label: "Transaction History",
    title:
      "What were the previous transactions of 0x1db3439a222c519ab44bb1144fc28167b4fa6ee6?",
  },
  {
    label: "Trading Volume",
    title: "How much USDC was traded in the last hour?",
  },
];

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const { mutate: sendPrompt, isPending } = trpc.ai.prompt.useMutation({
    onMutate: (result) => {
      // Optimistically add the user's query to the conversation
      chatHistory$.messages.push({
        role: "user",
        message: query,
        status: "success",
      });
      setQuery("");
    },
    onError: () => {
      chatHistory$.messages.push({
        role: "assistant",
        message: "Something went wrong while trying to generate a response",
        status: "error",
      });
    },
    onSuccess: (result) => {
      chatHistory$.messages.push({
        role: "assistant",
        tables: result.tables,
        message: result.message,
        status: result.status,
      });
    },
  });

  return (
    <div className={cn("flex h-full w-full max-w-full flex-col gap-8")}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-2xl text-center justify-center">
          <h1
            className={title({ color: "violet" })}
            style={{
              backgroundImage: `linear-gradient(275deg,#22a5ff,#66ecff 34%,#b0d0f7 55%,#f3b9f1 78%,#9053bf)`,
            }}
          >
            Ethereum
          </h1>
          <h1 className={title()}>, without the data science degree</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Removing the complexity of blockchain data and analytics
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            Check out the GitHub Repository
          </Link>
        </div>
      </section>

      <div className={cn("flex h-full flex-col")}>
        <Conversation />
      </div>
      <div className="flex flex-col gap-2 max-w-2xl mx-auto">
        <ScrollShadow
          hideScrollBar
          className="flex flex-nowrap gap-2"
          orientation="horizontal"
        >
          <div className="flex gap-2">
            {ideas.map(({ title, label }, index) => (
              <Button
                key={index}
                className="flex flex-col h-12 items-start gap-0"
                size={"sm"}
                variant="flat"
                onPress={() => {
                  setQuery(title);
                  inputRef.current?.focus();
                }}
              >
                <p className={"text-2xs uppercase opacity-60 font-semibold"}>
                  {label}
                </p>
                <p>{title}</p>
              </Button>
            ))}
          </div>
        </ScrollShadow>
        <form
          className="mt-2 w-full flex justify-center max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();

            const { messages } = chatHistory$.get();

            if (query.length > 0) {
              sendPrompt({
                messages: [
                  ...messages.filter((m) => m.status === "success"),
                  {
                    role: "user",
                    message: query,
                  },
                ],
                tables: messages.flatMap((m) => m.tables ?? []),
              });
            }
          }}
        >
          <Input
            ref={inputRef}
            aria-label="Ask the blockchain anything"
            classNames={{
              inputWrapper:
                "bg-default-100 !focus:outline-violet !focus:ring-violet",
              input: "text-sm !focus:outline-violet !focus:ring-violet",
            }}
            endContent={
              <button disabled={!query.length} type={"submit"}>
                {isPending ? (
                  <Spinner size={"sm"} className={"mt-2"} />
                ) : (
                  <Kbd className="hidden lg:inline-block" keys={["enter"]} />
                )}
              </button>
            }
            labelPlacement="outside"
            placeholder="Ask the blockchain anything..."
            startContent={
              <SearchIcon className="text-base text-default-400 pointer-events-none mr-2 flex-shrink-0" />
            }
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size={"lg"}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
        <div className={"flex justify-between gap-x-2 mb-4"}>
          <p className="px-2 text-tiny text-default-800">
            t3rnscan can make mistakes. Consider checking important information.
          </p>
          <p className="px-2 text-tiny text-default-800">
            Powered by Etherscan.io APIs
          </p>
        </div>
      </div>
    </div>
  );
}
