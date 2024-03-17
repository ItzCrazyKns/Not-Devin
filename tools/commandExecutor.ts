import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as shelljs from "shelljs";
import { confirm } from '@inquirer/prompts';

const commandExecutorTool = new DynamicStructuredTool({
    name: "command-executor",
    description: "This tool can be used to execute command on the system. You can use this to install packages and run code.",
    schema: z.object({
        command: z.string().describe("The command to execute in the shell"),
    }),
    func: async ({ command }) => {
        try {
            const conf = await confirm({ message: `Are you sure you want to execute the command: ${command}` })
            if(!conf) return "User denied the command execution"
            const res = shelljs.exec(command).stderr.trim()
            return res
        } catch (err: any) {
            return err.toString()
        }
    }
})

export default commandExecutorTool