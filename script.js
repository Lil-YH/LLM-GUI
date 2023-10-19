import { config } from "dotenv"
config()

import { OpenAI } from "openai"
import { stdout } from "process";
import readline from "readline"

const openai = new OpenAI({
    apiKey: process.env.API_KEY
});

const userInterface = readline.createInterface({
    input: process.stdin,
    output: stdout,
});

let messages = new Array();

let generateReport = async () => {
    const completion = await openai.chat.completions.create({
        messages: messages,
        model: "ft:gpt-3.5-turbo-0613:personal::8BO6cC3R",
      });
    console.log("Report for attending doctor:\n\n" + completion.choices[0].message.content);
}

// Define the regular expression pattern
const pattern = /assist with your diagnosis and treatment/i; // 'i' flag for case-insensitive matching

messages.push({ role: "system", content: "You are a chatbot. A patient will be interacting with you. You are to lead the conversation with the patient in order to obtain details about their symptoms, medical history until you have determined to have collected enough relevant data. Do not provide any diagnosis or medical advice to the patient. After ending the conversation with the patient, generate a summary of the data you gathered and propose 3 most possible diagnoses with an accompanying confidence level. Start the conversation with this phrase: \"Hi! I'm MediBot. Before we start, could I have your name please?\". Always direct the conversation back to medical and do not respond to questions unrelated to the conversation." })

const completion = await openai.chat.completions.create({
    messages: messages,
    model: "ft:gpt-3.5-turbo-0613:personal::8BO6cC3R",
  });
console.log(completion.choices[0].message.content);


userInterface.prompt();
userInterface.on("line", async input => {
    messages.push({ role: "user", content: input});
    const res = await openai.chat.completions.create({
        model: "ft:gpt-3.5-turbo-0613:personal::8BO6cC3R",
        messages: messages
    })
    messages.push(res.choices[0].message);
    console.log(res.choices[0].message.content);

    if(pattern.test(res.choices[0].message.content)) {
        generateReport();
        // console.log("Last Message");
    } else {
        // console.log("Conversation continuing...");
        userInterface.prompt();
    }

});

