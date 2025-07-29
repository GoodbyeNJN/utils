import { isString } from "@/remeda";
import { ResultAsync } from "@/result";

import { errorToMessage } from "./error";
import { PromiseWithResolvers } from "./promise";

export const $ = (cmd: TemplateStringsArray | string) => {
    const command = isString(cmd) ? cmd : cmd[0]!;

    const promise = import("node:child_process").then(({ exec }) => {
        const { promise, reject, resolve } = PromiseWithResolvers<{
            stdout: string;
            stderr: string;
        }>();

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });

        return promise;
    });

    return ResultAsync.fromPromise(promise, errorToMessage(`Failed to execute command: ${cmd}`));
};
