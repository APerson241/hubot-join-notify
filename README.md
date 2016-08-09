# hubot-join-notify
Get a notification when a Slack user comes online.

Watches Slack's RTM API for `presence_change` events and notifies interested users.

## Installation

Add **hubot-join-notify** to your `package.json` file:

```
npm install --save hubot-join-notify
```

Add **hubot-join-notify** to your `external-scripts.json`:

```json
["hubot-join-notify"]
```

Run `npm install`

## Sample Interaction

```
me>> @hubot: stalk @person
hubot>> @me: I will notify you when person comes online.
```

(Later, after @person is online...)

```
hubot>> @me: person is online.
```
