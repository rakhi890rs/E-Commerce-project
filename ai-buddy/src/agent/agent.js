const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} = require("@langchain/langgraph");
const { ToolMessage } = require("@langchain/core/messages");
const tools = require("./tools");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.5,
});

const modelWithTools = model.bindTools([
  tools.searchProduct,
  tools.addProductToCart,
]);

const graph = new StateGraph(MessagesAnnotation)

  .addNode("tools", async (state, config) => {
    const lastMessage = state.messages[state.messages.length - 1];
    const toolCalls = lastMessage.tool_calls || [];

    const toolCallResults = await Promise.all(
      toolCalls.map(async (call) => {
        const selectedTool = tools[call.name];

        if (!selectedTool) {
          throw new Error(`Tool ${call.name} not found`);
        }

        const toolInput = call.args || {};

        console.log("Graph token:", config?.metadata?.token);
        console.log("Tool call name:", call.name);
        console.log("Tool input:", toolInput);

        const toolResult = await selectedTool.func({
          ...toolInput,
          token: config?.metadata?.token,
        });

        console.log("Tool result:", toolResult);

        return new ToolMessage({
          content:
            typeof toolResult === "string"
              ? toolResult
              : JSON.stringify(toolResult),
          tool_call_id: call.id,
        });
      })
    );

    return { messages: toolCallResults };
  })

  .addNode("chat", async (state) => {
    const response = await modelWithTools.invoke([
      {
        role: "system",
        content: `
You are an AI shopping assistant.
Use the available tools to search products and add items to cart.
Do not ask the user for authentication token or internal backend details.
Authentication is handled automatically by the system.
After using tools, give a clear final response to the user.
`,
      },
      ...state.messages,
    ]);

    console.log("Chat node response:", response);

    return { messages: [response] };
  })

  .addEdge(START, "chat")

  .addConditionalEdges("chat", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];

    console.log("Last chat message:", lastMessage);
    console.log("Tool calls found:", lastMessage.tool_calls);

    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }

    return END;
  })

  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = agent;