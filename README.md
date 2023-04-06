![agents](https://user-images.githubusercontent.com/1221345/230161421-85f95bc3-28c6-4c57-a02d-75e23f6b4d8d.png)

# The Agents

Yet another ChatGPT UI, but more fit and svelte.

Backend/Frontend Sveltekit app to have multiple conversations with chatbots. It connects to the OpenAI API.

# Techstack

- [Sveltekit](https://kit.svelte.dev/https:/)
- [Skeleton](https://www.skeleton.dev/https:/)
- [Prisma](https://www.prisma.io/)
- [OpenAI API](https://openai.com/producthttps:/)

# Features

- [x] Open source
- [x] Deploy in your own server
- [x] Safely store your API Key in the server
- [x] You can also run the server locally in your machine
- [x] Configurable amount of messages to send
- [x] Configurable system message to guide the assistant
- [x] Start agents with predefined system message and prompt templates
- [x] Save all the messages in your database, continue your conversations later
- [x] Save the system message and prompt templates of conversations in the database
- [x] By default uses sqlite, but you can easily change the database to whatever you want, just code it
- [x] Prompt templates: Speed up your questions with predefined templates
- [x] Prompt template parameters: Add parameters to the template and change them easily for your needs.
- [ ] Streaming messages
- [ ] Edit messages
- [ ] Create images with Dall-e
- [ ] Voice input
- [ ] Voice answers
- [ ] Share conversations
- [ ] Plugins

# Setup

- Create a `.env` file with your OpenAI Api key, and the name of the prisma database, see `.env.example`. Your file should look like this:

```
SECRET_OPENAI_API_KEY="sk-XXXXXXXX"
DATABASE_URL="file:./database_name.db"
```

- `npm install`
- `npx prisma migrate dev` to start the database and apply the schema
- `npm run dev` to execute

# Screenshots

<img width="1728" alt="Screen Shot 2023-04-06 at 00 36 43" src="https://user-images.githubusercontent.com/1221345/230160377-284624cd-f71b-4662-b3bf-d9cad3339c44.png">

<img width="1728" alt="Screen Shot 2023-04-06 at 00 36 14" src="https://user-images.githubusercontent.com/1221345/230160641-824b4cb4-4175-4733-8532-8e0819855aea.png">

<img width="1728" alt="Screen Shot 2023-04-06 at 00 36 23" src="https://user-images.githubusercontent.com/1221345/230160666-6b7e4a1c-b821-47a9-b68e-68c907df9e6d.png">

<img width="1728" alt="Screen Shot 2023-04-06 at 00 36 32" src="https://user-images.githubusercontent.com/1221345/230160694-0a5dd987-3c10-4f78-8f1c-deea5bb9ac18.png">
