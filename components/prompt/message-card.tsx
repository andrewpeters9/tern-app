"use client";

import React from "react";
import { Avatar, Badge, Button, Link } from "@nextui-org/react";
import { useClipboard } from "@nextui-org/use-clipboard";
import { Icon } from "@iconify/react";

import { cn } from "@/utils/core";

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar?: string;
  showFeedback?: boolean;
  message?: React.ReactNode;
  currentAttempt?: number;
  status?: "success" | "error";
  attempts?: number;
  messageClassName?: string;
  onAttemptChange?: (attempt: number) => void;
  onMessageCopy?: (content: string | string[]) => void;
  onFeedback?: (feedback: "like" | "dislike") => void;
  onAttemptFeedback?: (feedback: "like" | "dislike" | "same") => void;
};

const MessageCard = React.forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      avatar,
      message,
      showFeedback,
      attempts = 1,
      currentAttempt = 1,
      status,
      onMessageCopy,
      onAttemptChange,
      onFeedback,
      onAttemptFeedback,
      className,
      messageClassName,
      ...props
    },
    ref,
  ) => {
    const [feedback, setFeedback] = React.useState<"like" | "dislike">();
    const messageRef = React.useRef<HTMLDivElement>(null);

    const { copied, copy } = useClipboard();

    const errorMessageClassName =
      status === "error"
        ? "bg-danger-100/50 border border-danger-100 text-foreground"
        : "";
    const errorMessage = (
      <p>
        Something went wrong, if the issue persists please contact us through
        our help center at&nbsp;
        <Link href="mailto:support@acmeai.com" size="sm">
          support@t3rnswap.com
        </Link>
      </p>
    );

    const hasFailed = status === "error";

    const handleCopy = React.useCallback(() => {
      let stringValue = "";

      if (typeof message === "string") {
        stringValue = message;
      } else if (Array.isArray(message)) {
        message.forEach((child) => {
          // @ts-ignore
          const childString =
            typeof child === "string"
              ? child
              : child?.props?.children?.toString();

          if (childString) {
            stringValue += childString + "\n";
          }
        });
      }

      const valueToCopy = stringValue || messageRef.current?.textContent || "";

      copy(valueToCopy);

      onMessageCopy?.(valueToCopy);
    }, [copy, message, onMessageCopy]);

    const handleFeedback = React.useCallback(
      (liked: boolean) => {
        setFeedback(liked ? "like" : "dislike");

        onFeedback?.(liked ? "like" : "dislike");
      },
      [onFeedback],
    );

    return (
      <div
        {...props}
        ref={ref}
        className={cn("flex gap-3 animate-appearance-in", className)}
      >
        <div className="relative flex-none">
          <Badge
            isOneChar
            color="danger"
            content={
              <Icon
                className="text-background"
                icon="gravity-ui:circle-exclamation-fill"
              />
            }
            isInvisible={!hasFailed}
            placement="bottom-right"
            shape="circle"
          >
            <Avatar src={avatar} />
          </Badge>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div
            className={cn(
              "relative w-full rounded-medium bg-content2 px-4 py-3 text-default-600",
              errorMessageClassName,
              messageClassName,
            )}
          >
            <div ref={messageRef} className={"pr-20 text-small"}>
              {hasFailed ? errorMessage : message}
            </div>
            {showFeedback && !hasFailed && (
              <div className="absolute right-2 top-2 flex rounded-full bg-content2 shadow-small">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={handleCopy}
                >
                  {copied ? (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:check"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:copy"
                    />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(true)}
                >
                  {feedback === "like" ? (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-up-fill"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-up"
                    />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(false)}
                >
                  {feedback === "dislike" ? (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-down-fill"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-down"
                    />
                  )}
                </Button>
              </div>
            )}
            {attempts > 1 && !hasFailed && (
              <div className="flex w-full items-center justify-end">
                <button
                  onClick={() =>
                    onAttemptChange?.(
                      currentAttempt > 1 ? currentAttempt - 1 : 1,
                    )
                  }
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="gravity-ui:circle-arrow-left"
                  />
                </button>
                <button
                  onClick={() =>
                    onAttemptChange?.(
                      currentAttempt < attempts ? currentAttempt + 1 : attempts,
                    )
                  }
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="gravity-ui:circle-arrow-right"
                  />
                </button>
                <p className="px-1 text-tiny font-medium text-default-500">
                  {currentAttempt}/{attempts}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default MessageCard;

MessageCard.displayName = "MessageCard";
