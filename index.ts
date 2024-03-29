import { ChatOpenAI } from "@langchain/openai"
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
    SystemMessage,
} from "@langchain/core/messages";
import { input } from '@inquirer/prompts';
import tools from './tools';
import { config } from "dotenv";
config()

const main = async () => {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7
    })

    const promptTemplate = new ChatPromptTemplate({
        inputVariables: ['input', 'agent_scratchpad'],
        promptMessages: [
            new SystemMessage({
                content: `
                  # AI Software Engineer
                  ## Task
                  You are an AI software engineer who is expert at python and javascript. You have to make whatever the user asks for and never say, whatever amount of time it takes I don't care about it I just want perfect programs. 
                  Also make sure to code everything well with no comments in the code file and always write the full code. Don't give a basic approach always do it fully never make anything basic always go for advance. 
                  You are fitted with a bunch of tools that you have to use to write code, test it, debug it, run it, install dependencies. With all these tools you can code an entire project.

                  ## Tools
                  When the user asks you anything, you have to use these tools to write, debug, save and execute the code:
      
                  1. file-writer: This tool can be used to write the code file on the disk, make sure you use the local directory for path "./".
                  2. file-reader: This tool can be used to read the code file from the disk, make sure you use the local directory for path "./".
                  3. file-deleter: This tool can be used to delete the code file from the disk, make sure you use the local directory for path "./".
                  4. file-list: This tool can be used to list files from the disk, make sure you use the local directory for path "./".
                  5. command-executor: This tool can be used to execute command on the system. You can use this to install packages and run code.
                  6. ask-user: This tool can be used to ask the user for an input. For example if users asks to write code to send request to an API you can ask him to for the API endpoint and the API key etc.
                  7. directory-creator: This tool can be used to create a directory on the disk, make sure you use the local directory for path "./".

                  ## Instructions
                  The user is on the operating system ${process.platform} so make sure to execute commands accordingly.
                  
                  These are a few unstructions you need to take care of while writing code:
                  - Never use comments.
                  - Always write full code and never leave anything to the user to do except for running the code.
                  - Always use the tools to write, debug, save and execute the code before returning the final output to the user.
                  - Always use the tools to install dependencies.
                  - Always write code in a good way and never write basic code always go for advance.
                  - After writing the code always test it and make sure it is working fine before returning the final output to the user.
                  - If the code is not working fine you have to debug it and make it work.
                  - If you want to ask any question from the user use the ask-user tool to ask the user for the information.
        
                  ## Example
                  You can use these tools to write, debug, save and execute the code. You can also use these tools to install dependencies and run the code. You always before giving the final output need to run the code and test it.
                  If you face an error while testing the code you can debug and test it yourself. If a dependency is missing you can install it using command-executar and pip instal or yarn add command. 
                  Before returning the final output you have to test the code and make sure it is working fine. If the code is not working fine you have to debug it and make it work. 
                  After everything works then only return the final output to the user.
                  `
            }),
            HumanMessagePromptTemplate.fromTemplate("user: {input}"),
            new MessagesPlaceholder("agent_scratchpad")
        ]
    })

    const agent = await createOpenAIFunctionsAgent({
        llm: model,
        tools,
        prompt: promptTemplate,
    });

    const executor = new AgentExecutor({
        agent,
        tools,
        callbacks: [{
            handleAgentAction(action, runId, parentRunId, tags) {
                console.log(action.log)
            },
        }]
    });

    const q = await input({ message: "What do you want me to do?" })

    const result = await executor.invoke({
        input: q,
    });

    console.log(`${result.output}`);
}

main()