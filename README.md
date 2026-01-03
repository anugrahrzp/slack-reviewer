# Slack Mention Reviewer

A self-hosted tool to review and respond to Slack mentions with AI-powered reply suggestions.

## 🏗️ Architecture

```
┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────────────┐
│  Slack   │───▶│  Zapier  │───▶│ Google Sheet │◀───│ GitHub Pages     │
│ @mention │    │ Trigger  │    │   (Data)     │    │ (This App)       │
└──────────┘    └──────────┘    └──────────────┘    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌────────────────┐
                                                    │  Claude API    │
                                                    │ (Reply Gen)    │
                                                    └────────────────┘
```

## 🚀 Setup

### 1. Create Google Sheet

Create a new Google Sheet with these columns:

| Column | Header | Description |
|--------|--------|-------------|
| A | Timestamp | When mention was captured |
| B | Channel | Slack channel name |
| C | Sender | Who mentioned you |
| D | Message | The message content |
| E | Link | Slack permalink |
| F | Priority | P1/P2/P3 |
| G | Context | Additional context |
| H | Replied | TRUE/FALSE |
| I | Your Reply | What you replied |
| J | Suggested Reply | AI-generated suggestion |

### 2. Deploy Google Apps Script API

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Paste the contents of `google-apps-script-api.js`
4. Click **Deploy > New Deployment**
5. Choose **Web app**
6. Set "Who has access" to **Anyone**
7. Click **Deploy** and copy the URL

### 3. Set Up Zapier (Optional - for auto-capture)

Create a Zap:
- **Trigger**: Slack - New Mention
- **Action**: Google Sheets - Create Row

Map fields:
- Timestamp: `{{zap_meta_human_now}}`
- Channel: `{{channel_name}}`
- Sender: `{{user_name}}`
- Message: `{{text}}`
- Link: `{{permalink}}`
- Priority: `P2` (default)

### 4. Host on GitHub Pages

1. Fork this repository
2. Go to **Settings > Pages**
3. Enable GitHub Pages from `main` branch
4. Your app will be at `https://yourusername.github.io/slack-reviewer/`

### 5. Configure the App

1. Open your hosted app
2. Click ⚙️ **Config**
3. Enter:
   - **Google Apps Script URL**: From step 2
   - **Claude API Key**: Your Anthropic API key
   - **Project Context**: (Optional) Custom context for better replies

## 🎮 Usage

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate mentions |
| `R` | Mark as replied |
| `O` | Open in Slack |
| `G` | Generate reply with Claude |

### Filters

- **⏳ Pending**: Unreplied mentions
- **✅ Replied**: Already handled
- **🔴 P1**: High priority only
- **🟠 P2**: Medium priority only

### Date Filters

- **All Dates**: Show everything
- **Today**: Today's mentions only
- **Yesterday**: Yesterday's mentions
- **This Week**: Current week

## 🔐 Security

- API keys are stored in browser localStorage
- Never commit API keys to the repository
- Google Apps Script URL should be kept private
- Consider adding authentication for production use

## 📝 Customizing Context

Edit the "Project Context" in settings to customize Claude's reply generation:

```
You are helping a [ROLE] at [COMPANY] draft Slack replies.

Context:
- [Your key responsibilities]
- [Current priorities]
- [Important metrics]

Guidelines:
- [Your preferred reply style]
- [Things to always include]
- [Things to avoid]
```

## 🛠️ Development

To run locally:

```bash
# Clone the repo
git clone https://github.com/yourusername/slack-reviewer.git

# Open index.html in browser
open index.html
```

No build step required - it's pure HTML/CSS/JS.

## 📄 License

MIT
