"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import {
	Plus,
	Bot,
	Play,
	Square,
	ScrollText,
	MessageCircle,
	Send,
	X,
	AlertCircle,
	Info,
	AlertTriangle,
} from "lucide-react";

type AgentStatus = "idle" | "running" | "stopped";

interface Agent {
	id: string;
	name: string;
	task: string;
	status: AgentStatus;
	createdAt: string;
}

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
	id: string;
	agentId: string;
	timestamp: string;
	level: LogLevel;
	message: string;
}

type ChatRole = "user" | "assistant";

interface ChatMessage {
	id: string;
	agentId: string;
	role: ChatRole;
	content: string;
	timestamp: string;
}

const MOCK_AGENTS: Agent[] = [
	{
		id: "agent-1",
		name: "BONK Buyer",
		task: "Buy BONK when price drops 2%, sell after 5% stop loss",
		status: "idle",
		createdAt: new Date().toISOString(),
	},
	{
		id: "agent-2",
		name: "Stop-loss guard",
		task: "Monitor SOL position and sell if down 10%",
		status: "idle",
		createdAt: new Date().toISOString(),
	},
];

const MOCK_LOGS: LogEntry[] = [
	{
		id: "log-1",
		agentId: "agent-1",
		timestamp: new Date(Date.now() - 60000).toISOString(),
		level: "info",
		message: "Agent created.",
	},
];

const MOCK_CHAT: ChatMessage[] = [
	{
		id: "chat-1",
		agentId: "agent-1",
		role: "assistant",
		content:
			"Hi! I'm BONK Buyer. I'll buy BONK when price drops 2% and sell after 5% stop loss. Ask me to run, change settings, or check status.",
		timestamp: new Date(Date.now() - 120000).toISOString(),
	},
];

function generateId(): string {
	return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AgentsPage() {
	const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
	const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
	const [createOpen, setCreateOpen] = useState(false);
	const [logsAgentId, setLogsAgentId] = useState<string | null>(null);
	const [chatAgentId, setChatAgentId] = useState<string | null>(null);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT);
	const [chatInput, setChatInput] = useState("");
	const [chatSending, setChatSending] = useState(false);
	const [createName, setCreateName] = useState("");
	const [createTask, setCreateTask] = useState("");

	const addLog = useCallback(
		(agentId: string, level: LogLevel, message: string) => {
			setLogs((prev) => [
				...prev,
				{
					id: generateId(),
					agentId,
					timestamp: new Date().toISOString(),
					level,
					message,
				},
			]);
		},
		[],
	);

	const updateAgentStatus = useCallback((id: string, status: AgentStatus) => {
		setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
	}, []);

	const runAgent = useCallback(
		(agent: Agent) => {
			if (agent.status === "running") return;
			updateAgentStatus(agent.id, "running");
			addLog(agent.id, "info", "Agent started.");
			const steps = [
				{ level: "info" as const, message: "Checking market conditions..." },
				{ level: "info" as const, message: "Placed buy order for BONK." },
				{ level: "info" as const, message: "Stop loss set at -5%." },
				{ level: "warn" as const, message: "Price approaching stop level." },
				{ level: "info" as const, message: "Run completed." },
			];
			let delay = 0;
			steps.forEach((step, i) => {
				delay += 600;
				setTimeout(() => {
					addLog(agent.id, step.level, step.message);
					if (i === steps.length - 1) {
						updateAgentStatus(agent.id, "stopped");
					}
				}, delay);
			});
		},
		[addLog, updateAgentStatus],
	);

	const stopAgent = useCallback(
		(agent: Agent) => {
			if (agent.status !== "running") return;
			updateAgentStatus(agent.id, "stopped");
			addLog(agent.id, "info", "Stopped by user.");
		},
		[addLog, updateAgentStatus],
	);

	const handleCreate = useCallback(() => {
		const name = createName.trim();
		const task = createTask.trim();
		if (!name) return;
		const id = generateId();
		const newAgent: Agent = {
			id,
			name,
			task: task || "No task specified",
			status: "idle",
			createdAt: new Date().toISOString(),
		};
		setAgents((prev) => [...prev, newAgent]);
		addLog(id, "info", "Agent created.");
		setChatMessages((prev) => [
			...prev,
			{
				id: generateId(),
				agentId: id,
				role: "assistant",
				content: `Hi! I'm ${name}. ${task ? `My task: ${task}` : "Give me a task or chat to configure me."}`,
				timestamp: new Date().toISOString(),
			},
		]);
		setCreateName("");
		setCreateTask("");
		setCreateOpen(false);
	}, [createName, createTask, addLog]);

	const agentLogs = logsAgentId
		? logs
				.filter((l) => l.agentId === logsAgentId)
				.sort(
					(a, b) =>
						new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
				)
		: [];
	const logsAgent = logsAgentId
		? agents.find((a) => a.id === logsAgentId)
		: null;

	const agentChatMessages = chatAgentId
		? chatMessages
				.filter((m) => m.agentId === chatAgentId)
				.sort(
					(a, b) =>
						new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
				)
		: [];
	const chatAgent = chatAgentId
		? agents.find((a) => a.id === chatAgentId)
		: null;

	const sendChatMessage = useCallback(() => {
		const text = chatInput.trim();
		if (!text || !chatAgentId || chatSending) return;
		const userMsg: ChatMessage = {
			id: generateId(),
			agentId: chatAgentId,
			role: "user",
			content: text,
			timestamp: new Date().toISOString(),
		};
		setChatMessages((prev) => [...prev, userMsg]);
		setChatInput("");
		setChatSending(true);
		setTimeout(() => {
			const agent = agents.find((a) => a.id === chatAgentId);
			const canned = [
				`Got it. I'll keep that in mind for my task: "${agent?.task ?? "N/A"}".`,
				"I'm on it. Check the Logs panel for execution details.",
				"Understood. You can Run me from the card when you're ready.",
				"Noted. I'll apply that when I run next.",
			];
			const reply: ChatMessage = {
				id: generateId(),
				agentId: chatAgentId,
				role: "assistant",
				content:
					canned[Math.floor(Math.random() * canned.length)] +
					" (This is a mock response.)",
				timestamp: new Date().toISOString(),
			};
			setChatMessages((prev) => [...prev, reply]);
			setChatSending(false);
		}, 800);
	}, [chatInput, chatAgentId, chatSending, agents]);

	return (
		<>
			<Header />
			<div className="flex flex-1 flex-col gap-8 px-6 pt-8">
				<section className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1
							className="text-2xl text-neutral-900"
							style={{
								fontFamily:
									"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
							}}
						>
							Agents
						</h1>
						<p
							className="mt-1 text-sm text-neutral-500"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							Build agents that run tasks like buy/sell and stop loss.
						</p>
					</div>
					<button
						type="button"
						onClick={() => setCreateOpen(true)}
						className="flex items-center gap-2 rounded-sm border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						<Plus className="h-4 w-4" strokeWidth={2} />
						Create agent
					</button>
				</section>

				{agents.length === 0 ? (
					<div
						className="flex flex-col items-center justify-center rounded-sm border border-neutral-200 bg-white py-16 text-center"
						style={{ fontFamily: "var(--font-hedvig-sans), sans-serif" }}
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
							<Bot className="h-6 w-6" strokeWidth={1.5} />
						</div>
						<p className="mt-4 text-base font-medium text-neutral-900">
							No agents yet
						</p>
						<p className="mt-1 text-sm text-neutral-500">
							Create your first agent and give it a task to run.
						</p>
						<button
							type="button"
							onClick={() => setCreateOpen(true)}
							className="mt-6 flex items-center gap-2 rounded-sm border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
						>
							<Plus className="h-4 w-4" strokeWidth={2} />
							Create agent
						</button>
					</div>
				) : (
					<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{agents.map((agent) => (
							<div
								key={agent.id}
								className="flex flex-col rounded-sm border border-neutral-200 bg-white p-4"
							>
								<div className="flex items-start gap-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-neutral-600">
										<Bot className="h-5 w-5" strokeWidth={1.5} />
									</div>
									<div className="min-w-0 flex-1">
										<h2
											className="text-sm font-medium text-neutral-900"
											style={{
												fontFamily:
													"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
											}}
										>
											{agent.name}
										</h2>
										<p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
											{agent.task}
										</p>
										<span
											className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
												agent.status === "running"
													? "bg-amber-100 text-amber-800"
													: agent.status === "stopped"
														? "bg-neutral-100 text-neutral-600"
														: "bg-neutral-100 text-neutral-500"
											}`}
										>
											{agent.status}
										</span>
									</div>
								</div>
								<div className="mt-4 flex flex-wrap gap-2">
									<button
										type="button"
										onClick={() => runAgent(agent)}
										disabled={agent.status === "running"}
										className="flex items-center gap-1.5 rounded-sm border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<Play className="h-3.5 w-3.5" strokeWidth={2} />
										Run
									</button>
									<button
										type="button"
										onClick={() => stopAgent(agent)}
										disabled={agent.status !== "running"}
										className="flex items-center gap-1.5 rounded-sm border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<Square className="h-3.5 w-3.5" strokeWidth={2} />
										Stop
									</button>
									<button
										type="button"
										onClick={() => setLogsAgentId(agent.id)}
										className="flex items-center gap-1.5 rounded-sm border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
									>
										<ScrollText className="h-3.5 w-3.5" strokeWidth={2} />
										Logs
									</button>
									<button
										type="button"
										onClick={() => setChatAgentId(agent.id)}
										className="flex items-center gap-1.5 rounded-sm border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
									>
										<MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
										Chat
									</button>
								</div>
							</div>
						))}
					</section>
				)}
			</div>

			{/* Create agent modal */}
			{createOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
					onClick={() => setCreateOpen(false)}
					role="dialog"
					aria-modal="true"
					aria-labelledby="create-agent-title"
				>
					<div
						className="w-full max-w-md rounded-sm border border-neutral-200 bg-white p-6 shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between">
							<h2
								id="create-agent-title"
								className="text-lg font-medium text-neutral-900"
								style={{
									fontFamily:
										"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
								}}
							>
								Create agent
							</h2>
							<button
								type="button"
								onClick={() => setCreateOpen(false)}
								className="rounded-sm p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
								aria-label="Close"
							>
								<X className="h-5 w-5" strokeWidth={2} />
							</button>
						</div>
						<div className="mt-4 space-y-4">
							<div>
								<label
									htmlFor="agent-name"
									className="block text-sm font-medium text-neutral-700"
								>
									Name
								</label>
								<input
									id="agent-name"
									type="text"
									value={createName}
									onChange={(e) => setCreateName(e.target.value)}
									placeholder="e.g. BONK Buyer"
									className="mt-1 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
							</div>
							<div>
								<label
									htmlFor="agent-task"
									className="block text-sm font-medium text-neutral-700"
								>
									Task
								</label>
								<textarea
									id="agent-task"
									value={createTask}
									onChange={(e) => setCreateTask(e.target.value)}
									placeholder="e.g. Buy BONK when price drops 2%, sell after 5% stop loss"
									rows={3}
									className="mt-1 w-full resize-none rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setCreateOpen(false)}
								className="rounded-sm border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleCreate}
								disabled={!createName.trim()}
								className="rounded-sm border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Create
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Logs panel */}
			{logsAgentId && logsAgent && (
				<div
					className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40"
					role="dialog"
					aria-modal="true"
					aria-labelledby="logs-panel-title"
				>
					<div
						className="flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between border-b border-neutral-200 p-4">
							<h2
								id="logs-panel-title"
								className="text-lg font-medium text-neutral-900"
								style={{
									fontFamily:
										"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
								}}
							>
								Logs: {logsAgent.name}
							</h2>
							<button
								type="button"
								onClick={() => setLogsAgentId(null)}
								className="rounded-sm p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
								aria-label="Close logs"
							>
								<X className="h-5 w-5" strokeWidth={2} />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto p-4">
							{agentLogs.length === 0 ? (
								<p className="text-sm text-neutral-500">No logs yet.</p>
							) : (
								<ul className="space-y-2 font-mono text-xs">
									{agentLogs.map((entry) => {
										const Icon =
											entry.level === "error"
												? AlertCircle
												: entry.level === "warn"
													? AlertTriangle
													: Info;
										const color =
											entry.level === "error"
												? "text-red-600"
												: entry.level === "warn"
													? "text-amber-600"
													: "text-neutral-600";
										return (
											<li
												key={entry.id}
												className="flex gap-2 rounded-sm border border-neutral-100 bg-neutral-50/50 p-2"
											>
												<Icon
													className={`h-3.5 w-3.5 shrink-0 ${color}`}
													strokeWidth={2}
												/>
												<div className="min-w-0 flex-1">
													<span className="text-neutral-400">
														{new Date(entry.timestamp).toLocaleTimeString()}
													</span>
													<span className={`ml-1.5 ${color}`}>
														[{entry.level}]
													</span>
													<p className="mt-0.5 text-neutral-800">
														{entry.message}
													</p>
												</div>
											</li>
										);
									})}
								</ul>
							)}
						</div>
					</div>
					<button
						type="button"
						className="flex-1"
						aria-label="Close"
						onClick={() => setLogsAgentId(null)}
					/>
				</div>
			)}

			{/* Chat panel */}
			{chatAgentId && chatAgent && (
				<div
					className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40"
					role="dialog"
					aria-modal="true"
					aria-labelledby="chat-panel-title"
				>
					<div
						className="flex h-full w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex shrink-0 items-center justify-between border-b border-neutral-200 p-4">
							<h2
								id="chat-panel-title"
								className="text-lg font-medium text-neutral-900"
								style={{
									fontFamily:
										"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
								}}
							>
								Chat: {chatAgent.name}
							</h2>
							<button
								type="button"
								onClick={() => setChatAgentId(null)}
								className="rounded-sm p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
								aria-label="Close chat"
							>
								<X className="h-5 w-5" strokeWidth={2} />
							</button>
						</div>
						<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
							<div className="min-h-0 flex-1 overflow-y-auto space-y-3 p-4">
								{agentChatMessages.length === 0 ? (
									<p className="text-sm text-neutral-500">
										No messages yet. Say something to {chatAgent.name}.
									</p>
								) : (
									agentChatMessages.map((msg) => (
										<div
											key={msg.id}
											className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
										>
											<div
												className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
													msg.role === "user"
														? "bg-neutral-900 text-white"
														: "bg-neutral-100 text-neutral-900"
												}`}
											>
												<p className="whitespace-pre-wrap">{msg.content}</p>
												<span
													className={`mt-1 block text-xs ${msg.role === "user" ? "text-neutral-300" : "text-neutral-500"}`}
												>
													{new Date(msg.timestamp).toLocaleTimeString()}
												</span>
											</div>
										</div>
									))
								)}
							</div>
							<div className="shrink-0 border-t border-neutral-200 p-3">
								<div className="flex items-center gap-2 rounded-sm border border-neutral-300 bg-white pr-2 focus-within:ring-2 focus-within:ring-neutral-400 focus-within:ring-offset-0">
									<input
										type="text"
										value={chatInput}
										onChange={(e) => setChatInput(e.target.value)}
										onKeyDown={(e) =>
											e.key === "Enter" && !e.shiftKey && sendChatMessage()
										}
										placeholder="Message the agent..."
										className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
										style={{
											fontFamily:
												"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
										}}
										aria-label="Chat input"
									/>
									<button
										type="button"
										onClick={sendChatMessage}
										disabled={!chatInput.trim() || chatSending}
										className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
										aria-label="Send"
									>
										<Send className="h-4 w-4" strokeWidth={2} />
									</button>
								</div>
							</div>
						</div>
					</div>
					<button
						type="button"
						className="flex-1"
						aria-label="Close"
						onClick={() => setChatAgentId(null)}
					/>
				</div>
			)}
		</>
	);
}
