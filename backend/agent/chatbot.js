const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { Annotation, StateGraph, END, START } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { tools } = require("./tools");
const { HumanMessage, AIMessage, ToolMessage } = require("@langchain/core/messages");
require("dotenv").config();

// Define the state
const MessageState = Annotation.Root({
    messages: Annotation({
        reducer: (x, y) => x.concat(y),
    }),
});

// Initialize the LLM
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
}).bindTools(tools);

// Define the decision node
function shouldContinue(state) {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];

    // If the LLM has made tool calls, then we route to the "tools" node
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return "tools";
    }
    // Otherwise, we stop (reply to the user)
    return END;
}

// Define the model node
async function callModel(state) {
    const { messages } = state;
    const response = await model.invoke(messages);
    // We return a list, because this will get added to the existing list
    return { messages: [response] };
}

// Define the graph
const workflow = new StateGraph(MessageState)
    .addNode("agent", callModel)
    .addNode("tools", new ToolNode(tools))
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

// Compile the graph
const app = workflow.compile();

async function chat(userMessages) {
    // Convert messages to LangChain format if they are raw objects
    const formattedMessages = userMessages.map(m => {
        if (m.role === 'user') return new HumanMessage(m.content);
        if (m.role === 'assistant') return new AIMessage(m.content);
        return m; // fallback for complex types
    });

    const finalState = await app.invoke({
        messages: formattedMessages
    });

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    return {
        content: lastMessage.content,
        role: 'assistant'
    };
}

module.exports = { chat };
