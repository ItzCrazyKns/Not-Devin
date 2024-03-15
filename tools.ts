import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as fs from "fs"
import * as shelljs from "shelljs";
import { input, confirm } from '@inquirer/prompts';

export const tools = [
    new DynamicStructuredTool({
        name: "file-writer",
        description: "This tool can be used to write file on the disk",
        schema: z.object({
            content: z.string().describe("The content to write in the file"),
            path: z.string().describe("The path of the file to write"),
            name: z.string().describe("The name of the file to write"),
        }),
        func: async ({ content, name, path }) => {
            try {
                fs.writeFileSync(`${path}/${name}`, content)
                return `File written successfully at ${path}/${name}`
            } catch (err: any) {
                return err.toString()
            }
        }
    }),
    new DynamicStructuredTool({
        name: "file-reader",
        description: "This tool can be used to read file from the disk",
        schema: z.object({
            path: z.string().describe("The path of the file to read"),
            name: z.string().describe("The name of the file to read"),
        }),
        func: async ({ path, name }) => {
            try {
                return fs.readFileSync(`${path}/${name}`, "utf-8")
            } catch (err: any) {
                return err.toString()
            }
        }
    }),
    new DynamicStructuredTool({
        name: "file-deleter",
        description: "This tool can be used to delete file from the disk",
        schema: z.object({
            path: z.string().describe("The path of the file to delete"),
            name: z.string().describe("The name of the file to delete"),
        }),
        func: async ({ path, name }) => {
            try {
                fs.unlinkSync(`${path}/${name}`)
                return `File deleted successfully from ${path}/${name}`
            } catch (err: any) {
                return err.toString()
            }
        }
    }),
    new DynamicStructuredTool({
        name: "directory-creator",
        description: "This tool can be used to create a directory on the disk",
        schema: z.object({
            path: z.string().describe("The path of the directory to create"),
            name: z.string().describe("The name of the directory to create"),
        }),
        func: async ({ path, name }) => {
            try {
                fs.mkdirSync(`${path}/${name}`)
                return `Directory created successfully at ${path}/${name}`
            } catch (err: any) {
                return err.toString()
            }
        }
    }),
    new DynamicStructuredTool({
        name: "file-list",
        description: "This tool can be used to list files from the disk",
        schema: z.object({
            path: z.string().describe("The path of the directory to list files from"),
        }),
        func: async ({ path }) => {
            try {
                return fs.readdirSync(path).join(", ")
            } catch (err: any) {
                return err.toString()
            }
        }
    }),
    new DynamicStructuredTool({
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
    }),
    new DynamicStructuredTool({
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
    }),
]