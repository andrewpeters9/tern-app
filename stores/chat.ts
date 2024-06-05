import {observable} from "@legendapp/state";
import {syncObservable} from "@legendapp/state/sync";
import {ObservablePersistLocalStorage} from "@legendapp/state/persist-plugins/local-storage";

export const chatHistory$ = observable({
  messages: [] as Array<{
    role: "assistant" | "user";
    message: string;
    status: "success" | "error";
    tables?: Array<string>;
  }>,
});

syncObservable(chatHistory$, {
  persist: {
    name: "chat-history",
    plugin: ObservablePersistLocalStorage,
  },
});
