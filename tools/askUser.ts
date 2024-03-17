import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

import { input } from '@inquirer/prompts';

const askUserTool = new DynamicStructuredTool({
    name: "ask-user",
    description: "This tool can be used to ask the user for an input or a question. When you are stuck and need some information from the user you can use this tool to ask the user for the information. For example if users asks to write code to send request to an API you can ask him to for the API endpoint and the API key etc.",
    schema: z.object({
        question: z.string().describe("The question to ask the user"),
    }),
    func: async ({ question }) => {
        try {
            const res = await input({ message: question })
            return res
        } catch (err: any) {
            return err.toString()
        }
    }
})

export default askUserTool