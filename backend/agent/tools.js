const { tool } = require("@langchain/core/tools");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");

// Tool 1: Knowledge Base Tool
const knowledgeBaseTool = tool(
    async ({ query }) => {
        const dataPath = path.join(__dirname, "../data/company_info.json");
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        // Simple logic: return the whole thing or filter based on query (for simplicity, return all)
        return JSON.stringify(data);
    },
    {
        name: "knowledge_base",
        description: "Fetch information about 'Fly Your Tech' company, including address, contact details, services, and pricing.",
        schema: z.object({
            query: z.string().describe("The company-related query"),
        }),
    }
);

// Tool 2: Lead Management Tool
const leadManagementTool = tool(
    async ({ action, leadId, leadData }) => {
        const dataPath = path.join(__dirname, "../data/leads.json");
        let leads = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        if (action === "read_all") {
            return JSON.stringify(leads);
        } else if (action === "get_lead" && leadId) {
            const lead = leads.find((l) => l.id === leadId || l.email === leadId);
            return lead ? JSON.stringify(lead) : "Lead not found.";
        } else if (action === "create_lead" && leadData) {
            const newLead = { id: Date.now().toString(), ...leadData, status: "New" };
            leads.push(newLead);
            fs.writeFileSync(dataPath, JSON.stringify(leads, null, 2));
            return `Lead created successfully with ID: ${newLead.id}`;
        }
        return "Invalid action or missing parameters for lead management.";
    },
    {
        name: "lead_management",
        description: "Manage sales leads. Actions include: read_all, get_lead (by ID or email), create_lead.",
        schema: z.object({
            action: z.enum(["read_all", "get_lead", "create_lead"]).describe("The action to perform"),
            leadId: z.string().optional().describe("Lead ID or email for get_lead"),
            leadData: z.object({
                name: z.string(),
                email: z.string(),
                service_interested: z.string().optional(),
            }).optional().describe("Lead data for create_lead"),
        }),
    }
);

// Tool 3: Scheduling Tool (Dummy)
const schedulingTool = tool(
    async ({ email, dateTime, purpose }) => {
        // In a real app, this might use Nodemailer or an external API
        console.log(`[DUMMY] Scheduling meeting for ${email} at ${dateTime} for ${purpose}`);
        return `Meeting successfully scheduled for ${email} on ${dateTime}. A calendar invite will be sent shortly.`;
    },
    {
        name: "schedule_meeting",
        description: "Schedule a meeting or send a calendar invite to a potential client.",
        schema: z.object({
            email: z.string().describe("Client email address"),
            dateTime: z.string().describe("Preferred date and time for the meeting"),
            purpose: z.string().describe("Reason for the meeting"),
        }),
    }
);

module.exports = {
    knowledgeBaseTool,
    leadManagementTool,
    schedulingTool,
    tools: [knowledgeBaseTool, leadManagementTool, schedulingTool],
};
