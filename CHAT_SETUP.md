# ILÉ host

The welcome chat and menu guide work without credentials. They are explicitly labelled as menu-guide mode.

For live AI replies, connect OpenAI Developers and provision an API key through its approved workflow. Set the hosted secret `OPENAI_API_KEY` and a supported text model in `OPENAI_CHAT_MODEL`, then redeploy the current version. No key belongs in frontend source or the hosting manifest.

The server uses the Responses API, bounds request/history sizes, disables response storage, and limits each guest source to 20 AI requests per hour. It uses the approved menu as context and returns validated dish IDs plus navigation actions. Chat has no authority to place orders or confirm reservations.

On provider failure, the interface labels the reply as menu-guide fallback. Guest chat history is kept in tab memory only. Reduced-motion settings disable automatic gallery movement; swipe and scroll remain usable. The carousel resumes automatically after touch or scrolling, and holds while a dish has keyboard focus.
