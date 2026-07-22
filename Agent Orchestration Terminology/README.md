# Agent Orchestration Terminology

**Agent orchestration** is the control layer that decides which agent or tool runs, in what order, with what context, under which limits, and how results are verified and combined.

The industry does not use one vocabulary. The same centralized coordination shape may be called an **orchestrator-worker pattern**, **manager agent**, **supervisor**, **hierarchical process**, or **subagent architecture**. Meanwhile, terms such as **handoff**, **router**, **workflow**, **group chat**, **swarm**, and **crew** describe related—but not always identical—control patterns.

This guide maps the terms without pretending every vendor abstraction is interchangeable. Terminology and sources were checked on **July 22, 2026**.

---

## The Concept Beneath the Names

Every orchestration system answers the same questions:

| Control question | Example decision |
|---|---|
| Decomposition | Split a report into research, analysis, and writing |
| Selection | Choose the billing specialist rather than technical support |
| Scheduling | Run sequentially, concurrently, or in a loop |
| Context | Decide what history, files, state, and tool results each worker sees |
| Handoff | Transfer control or call a specialist without transferring control |
| Aggregation | Merge, rank, vote, or synthesize worker outputs |
| Verification | Accept, retry, reject, or escalate a result |
| Governance | Enforce tools, permissions, budgets, approvals, and stop rules |
| State | Persist checkpoints, conversation, artifacts, and run status |
| Observability | Trace who did what, why, with which inputs and cost |

Orchestration may be implemented in deterministic code, delegated to an LLM, or split between the two.

---

## Vendor Vocabulary Map

| Ecosystem | Umbrella language | Central coordinator | Delegated unit | Other coordination terms |
|---|---|---|---|---|
| Anthropic | Workflows and agents; multi-agent orchestration | Orchestrator | Workers/subagents | Routing, parallelization, evaluator-optimizer |
| Claude Code | Agent teams and subagents | Lead/main agent | Teammate or subagent | Delegation, team coordination, background agents |
| OpenAI Agents SDK | Agent orchestration | Manager agent | Agent as tool | Handoffs, triage agent, orchestration via code |
| Google ADK | Multi-agent systems and workflow agents | Root/custom coordinating agent | Sub-agent | `SequentialAgent`, `ParallelAgent`, `LoopAgent`, delegation/transfer |
| Microsoft Agent Framework | Workflow orchestrations / multi-agent orchestration | Manager/orchestrator | Participant agent | Sequential, Concurrent, Handoff, Group Chat, Magentic |
| LangGraph / LangChain | Multi-agent patterns and custom workflows | Supervisor or main agent | Subagent/node | Handoffs, router, skills, graph/state graph |
| CrewAI | Crews, processes, and flows | Manager in hierarchical process; Flow for outer control | Agent/task | Sequential process, hierarchical process, event-driven Flow |

This is a conceptual translation table, not an API-compatibility table.

---

## Who Uses “Orchestration” Directly?

### OpenAI

The OpenAI Agents SDK uses **agent orchestration** for the flow of agents: which agents run, in what order, and who chooses the next step. It separates:

- **LLM orchestration:** the model plans, selects tools, or delegates.
- **Code orchestration:** application code chains, branches, loops, or runs agents concurrently.

Its two prominent multi-agent patterns are:

- **Agents as tools:** a manager keeps control and calls specialists for bounded tasks.
- **Handoffs:** the active agent transfers the conversation to a specialist, which takes control.

These are not synonyms. “Manager” preserves central ownership; “handoff” transfers it.

### Microsoft

Microsoft Agent Framework explicitly uses **workflow orchestrations** and names several built-in patterns:

- Sequential
- Concurrent
- Handoff
- Group Chat
- Magentic

Microsoft's terminology is particularly pattern-oriented: “orchestration” is the category, while each pattern states how control and context move.

### Anthropic

Anthropic uses **orchestrator-workers** for a pattern where a central LLM dynamically breaks down a task, delegates work, and synthesizes results. Anthropic also distinguishes **workflows**—predefined code paths—from **agents**, where the model dynamically controls its process and tool use.

In other words, orchestration can exist in both a deterministic workflow and a more autonomous agent system.

---

## Who Uses Other Terms for Similar Shapes?

### LangGraph: supervisor, graph, router, and subagents

LangGraph often expresses orchestration as a **graph** or **custom workflow**. A central coordinating agent is commonly a **supervisor**; specialized agents are **subagents** or graph nodes.

LangChain's broader multi-agent vocabulary includes:

- Subagents
- Handoffs
- Skills
- Router
- Custom workflow

“Graph” emphasizes explicit state transitions and execution topology. “Supervisor” emphasizes a centralized decision-maker. Together they often implement what another SDK calls orchestration.

### Google ADK: workflow agents

Google ADK uses deterministic **workflow agents**:

- `SequentialAgent`
- `ParallelAgent`
- `LoopAgent`

These coordinate sub-agents using fixed execution behavior rather than LLM reasoning. A custom or root agent may add dynamic delegation. This vocabulary treats orchestration as agent composition: an agent may itself be the workflow controller.

### CrewAI: crew, process, and flow

CrewAI calls a collaborating set of role-based agents a **Crew**. A **Process** defines how tasks are executed, commonly sequentially or hierarchically. A **Flow** provides structured, event-driven control and state around work, and can invoke crews.

The nearest translations are:

- Crew ≈ agent team
- Hierarchical process ≈ manager/orchestrator with workers
- Flow ≈ stateful workflow/orchestration layer

They overlap, but a crew names the participants while a flow names the control structure.

### Claude Code: lead, teammates, and subagents

Claude Code users commonly talk about **delegation**, **subagents**, **agent teams**, **lead agents**, and **teammates** rather than naming every run “orchestration.” The main session or team lead coordinates work, while subagents or teammates handle bounded tasks.

This is still orchestration when the lead chooses workers, supplies context, schedules dependencies, verifies outputs, and synthesizes a result.

---

## Pattern Translation Dictionary

### Central coordinator

These terms often describe the same broad topology:

```text
request → coordinator → specialists → coordinator → final result
```

| Term | Typical ecosystem | Nuance |
|---|---|---|
| Orchestrator | Anthropic/general | Decomposes, dispatches, and synthesizes |
| Manager agent | OpenAI/CrewAI/Microsoft | Keeps central control or assigns tasks |
| Supervisor | LangGraph | Routes among workers, often in a state graph |
| Lead agent | Claude Code/general | Owns task and coordinates teammates |
| Root agent | Google ADK | Top agent in an agent tree; may coordinate sub-agents |
| Hierarchical process | CrewAI | Manager assigns tasks to role-based agents |

Do not infer capabilities from the title. Check who owns the user conversation, state, tool permissions, verification, and final answer.

### Transfer of control

```text
triage agent → specialist agent → user
```

Common terms:

- Handoff
- Transfer
- Delegation with takeover
- Agent switch

A handoff usually means the receiving agent becomes active. Calling an agent **as a tool** is different: the caller remains active and consumes the specialist's result.

### Selection without collaboration

```text
input → classifier/router → one path
```

Common terms:

- Router
- Triage
- Dispatcher
- Intent classifier
- Conditional edge/branch

Routing is a narrow orchestration function. It does not imply multiple agents collaborate.

### Fixed ordered execution

```text
stage A → stage B → stage C
```

Common terms:

- Workflow
- Pipeline
- Chain
- Sequential process
- Sequential agent/orchestration
- DAG, when dependencies form a directed acyclic graph

“Chain” often suggests a simple linear sequence; “workflow” usually includes branching, state, retries, and external steps; “DAG” emphasizes dependency topology.

### Parallel execution

```text
             ┌→ worker A ─┐
request ─────┼→ worker B ─┼→ aggregate
             └→ worker C ─┘
```

Common terms:

- Parallelization
- Concurrent orchestration
- Fan-out/fan-in
- Map-reduce
- Ensemble
- Swarm, sometimes

These are not fully equivalent. An ensemble often gives several agents the same task and combines answers. Fan-out may partition different subtasks. A swarm may also include decentralized routing rather than one aggregator.

### Shared multi-party conversation

Common terms:

- Group chat
- Team conversation
- Round-robin collaboration
- Debate
- Panel/council

Group chat shares or synchronizes conversation history and selects speakers. It differs from independent parallel workers, which should not see or influence one another before aggregation.

### Iterative improvement

```text
generate → evaluate → revise → evaluate → stop
```

Common terms:

- Evaluator-optimizer
- Critic-reviser
- Reflection loop
- Generator-judge
- Review loop

This is orchestration even with only one generating agent and one evaluator. “Multi-agent” is not required for orchestration.

---

## Terms That Are Often Misused

### Orchestration vs workflow

- **Workflow** is the execution structure: steps, branches, triggers, and state transitions.
- **Orchestration** is the coordination responsibility across those steps, agents, tools, and constraints.

In practice, vendors often use the terms interchangeably. For design discussions, state whether the path is deterministic or model-directed.

### Orchestration vs agentic workflow

An agentic workflow contains one or more model-directed decisions inside a workflow. It may still have deterministic outer control. Calling the entire system “autonomous” hides where code, models, and humans actually decide.

### Agent team vs multi-agent system

An agent team usually implies named roles working toward one task. A multi-agent system is broader and may include independent or even competing agents. Most coding “teams” are centrally coordinated workflows, not open-ended distributed systems.

### Swarm

“Swarm” has been used for lightweight multi-agent handoffs, decentralized agent collaboration, and simply “many agents.” It is too ambiguous for an architecture decision without a topology diagram.

### Handoff vs delegation

All handoffs delegate, but not all delegation is a handoff. Delegation may return a result to the caller; a handoff usually transfers active control.

### Supervisor vs judge

A supervisor selects and coordinates work. A judge evaluates it. One agent can perform both roles, but combining them weakens independence and should be explicit.

---

## A Framework-Neutral Vocabulary

Use these terms in architecture documents to avoid vendor lock-in:

| Neutral term | Definition |
|---|---|
| Coordinator | Component deciding what runs next |
| Worker | Component performing a bounded task |
| Router | Component selecting a path from typed options |
| Handoff | Transfer of active control and relevant context |
| Agent-as-tool | Bounded specialist call that returns control to caller |
| Workflow | Explicit steps, branches, state, and transitions |
| Scheduler | Component deciding when work starts |
| Aggregator | Component combining independent results |
| Evaluator | Component judging result against criteria |
| Human gate | Point requiring human approval or input |
| Run state | Durable status and artifacts for one execution |
| Trace | Evidence of decisions, calls, outputs, costs, and timing |

Then map those neutral roles to the chosen SDK in an implementation appendix.

---

## How to Describe an Orchestration Precisely

Avoid:

> We use a swarm of agents to orchestrate the workflow.

Prefer:

```md
Topology: centralized coordinator with three independent workers.
Selection: application code partitions files by ownership.
Execution: workers run concurrently in isolated worktrees.
Context: each worker receives only its task brief and target files.
Aggregation: coordinator validates schemas and combines results.
Verification: deterministic tests plus a read-only reviewer.
State: run record and artifacts persisted in CI.
Limits: three workers, 15 minutes, $5 model budget.
Human gate: required before merge or external publication.
```

This description remains meaningful whether the implementation uses Claude Code, OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, or CrewAI.

---

## Selection Guide

| If you need | Prefer |
|---|---|
| Predictable compliance-sensitive flow | Code-orchestrated workflow |
| One specialist to take over user interaction | Handoff |
| Specialist help while one agent owns the answer | Agent-as-tool/subagent |
| Input classification into known domains | Router/triage |
| Independent subtasks for speed | Concurrent fan-out/fan-in |
| Ordered transformations | Sequential pipeline |
| Iterative critique and revision | Evaluator-optimizer loop |
| Collaborative multi-perspective discussion | Group chat/council |
| Dynamic decomposition with unknown subtasks | Orchestrator-workers |

Start with one agent or deterministic workflow. Add multi-agent orchestration when specialization, context isolation, parallelism, or independent verification measurably improves the result.

---

## Checklist

- [ ] The architecture names who decides the next step.
- [ ] Deterministic code decisions are separated from LLM decisions.
- [ ] Control transfer is distinguished from agent-as-tool calls.
- [ ] Context passed to each participant is explicit.
- [ ] Sequential, concurrent, loop, and group-chat behavior are not conflated.
- [ ] Aggregation and verification are separate responsibilities where risk warrants it.
- [ ] State, limits, permissions, and human gates are part of orchestration.
- [ ] Vendor terms are translated into a framework-neutral topology.
- [ ] A diagram or contract replaces ambiguous words such as “swarm.”

## Primary Sources

- [OpenAI Agents SDK: Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)
- [OpenAI Agents SDK: Handoffs](https://openai.github.io/openai-agents-python/handoffs/)
- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [Google ADK: Workflow agents](https://google.github.io/adk-docs/agents/workflow-agents/)
- [Microsoft Agent Framework: Workflow orchestrations](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)
- [LangChain/LangGraph: Multi-agent patterns](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/)
- [LangGraph Supervisor](https://langchain-ai.github.io/langgraphjs/reference/modules/langgraph-supervisor.html)
- [CrewAI documentation](https://docs.crewai.com/)

## See Also

- [`../AI Agent Patterns/`](../AI%20Agent%20Patterns/)
- [`../Agent Team Patterns/`](../Agent%20Team%20Patterns/)
- [`../Subagents/`](../Subagents/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Harness/`](../Harness/)
- [`../Always-On Agent Operations/`](../Always-On%20Agent%20Operations/)
